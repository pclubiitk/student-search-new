import { Student, Options } from "@/lib/types/data";
import { fetch_student_data } from "@/lib/data/api-client";
import { get_time_IDB, update_IDB, check_IDB } from "@/lib/data/indexeddb-manager";
import { prepare_worker } from "@/lib/workers/worker-handler";

let students: Student[] = [];
let new_students: Student[] | undefined = undefined;

//setting up the values for the fields in the Options component
const options: Options = {
	batch:[],
	hall:[],
	prog:[],
	dept:[],
	bloodgrp:[]
};

//execute when starting
(async function (): Promise<void> {
	let noLocalData = false;
	let cantGetData = false;
	let time = 0;
	try {
		console.log("Grabbing data locally...");
		students = await check_IDB();
		time = await get_time_IDB();
		console.log("Most recent data retrieval occurred on:");
		console.log(time);
		console.log("Preparing worker using local data...");
		prepare_worker(students, options);
	} catch (error) {
		console.error("Failed to find data locally");
		console.error(error);
		noLocalData = true;
	}
	if (noLocalData || Date.now() - time > 1000*60*60*24*7) {
	//update data every week
		try {
			console.log("Fetching data from API...");
			new_students = await fetch_student_data();
			if (new_students === undefined) {
				throw new Error("Failed to fetch student data from DB");
			}
			console.log("Updating local DB with API data...");
			await update_IDB(new_students);
		} catch (error) {
			console.error("Failed to fetch data from API and update local DB");
			console.error(error);
			cantGetData = true;
		}
		if (new_students !== undefined) {
			console.log("New data was fetched, so re-preparing worker...");
			students = new_students;
			prepare_worker(students, options);
		} else {
			console.log("Failed to fetch new data, so worker was not re-prepared.");
		}
	}
	
	if (noLocalData && cantGetData) {
		postMessage("Error");
		console.error("Could not find data locally or fetch it. This web app will not work.");
	}
})(); //execute immediately