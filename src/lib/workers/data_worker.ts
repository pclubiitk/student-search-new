import { Student, Options } from "@/lib/types/data";
import { fetch_student_data } from "@/lib/data/api-client";
import {
  get_time_IDB,
  update_IDB,
  check_IDB,
} from "@/lib/data/indexeddb-manager";
import { prepare_worker } from "@/lib/workers/worker-handler";
import { check_bacchas, check_query } from "@/lib/data/query-processor";

let students: Student[] = [];
let new_students: Student[] | undefined = undefined;

//setting up the values for the fields in the Options component
const options: Options = {
  batch: [],
  hall: [],
  prog: [],
  dept: [],
  bloodgrp: [],
};

self.onmessage = async (event: MessageEvent) => {
  const { command, payload } = event.data;

  switch (command) {
    case "initialize":
      await initializeData();
      break;
    case "query":
      self.postMessage({
        status: "query_results",
        results: check_query(payload, students),
      });
      break;
    case "get_family_tree":
      const student: Student = payload;
      const baapu = students.filter(
        (st: Student) => st.rollNo === student.bapu
      )[0]; //note that this can also be undefined - this will be handled by TreeCard
      const bacchas = check_bacchas(student.bachhas, students);
      self.postMessage({
        status: "family_tree_results",
        results: [baapu, student, bacchas],
      });
    default:
      self.postMessage({
        status: "error",
        message: `Worker received an unknown command:', ${command}`,
      });
  }
};

async function initializeData(): Promise<void> {
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
  if (noLocalData || Date.now() - time > 1000 * 60 * 60 * 24 * 7) {
    //update data every week
    try {
      console.log("Fetching data from API...");
      const res = await fetch_student_data();
      if (res === null) {
        throw new Error("Failed to fetch student data from DB");
      } else new_students = res;
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
    postMessage({
      status: "error",
      message:
        "Could not find data locally or fetch it. This web app will not work.",
    });
  }
}
