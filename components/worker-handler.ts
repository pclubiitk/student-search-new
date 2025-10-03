import { Student, Query, Options } from "./commontypes";
import { rollToYear, check_bacchas, check_query } from "./query-processor";

function prepare_worker(students: Student[], options: Options): void {
	//student data should be in a global variable called "students", and there should be a global variable "options" to take the list of options for everything
	//after filling the "options" variable, send "Worker ready" message and set up onmessage handler
	
	for (const st of students) {
		for (const key in options) {
			const optionKey = key as keyof Options;
			if (optionKey === "batch") {
				const year = rollToYear(st.i);
				if (!options.batch.includes(year)) {
					options.batch.push(year);
				}
			} else {
				const key0 = optionKey[0] as "h"|"p"|"d"|"b";
				if (!options[optionKey].includes(st[key0])) {
					options[optionKey].push(st[key0]);
				}
			}
		}
	}

	for (const key in options) {
		const optionKey = key as keyof Options;
		options[optionKey].sort();	
	}
	
	onmessage = function (event: MessageEvent) {
		if (event.data === "ready?") {
			postMessage("Worker ready");
		} else if (event.data === "Options") {
			postMessage(["Options", options]);
		} else if (Array.isArray(event.data)) {
			// data style: ["ft", student (an object as seen above)]
			const student: Student = event.data[1];
			const baapu = students.filter((st: Student) => (st.i === student.s))[0]; //note that this can also be undefined - this will be handled by TreeCard
			const bacchas = check_bacchas(student.c, students);
			postMessage(["ft", [baapu, student, bacchas]]);
		} else {
			//query stuff - should post list of satisfying students
			postMessage(["query", check_query(event.data, students)]);
		}
	}
	console.log("Worker ready");
	postMessage("Worker ready");
	postMessage(["Options", options]); //when worker processes everything it should send out options headers again
}

export { prepare_worker };
