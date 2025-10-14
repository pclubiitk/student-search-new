import { Student, Query } from "@/lib/types/data";
import Fuse from "fuse.js";

type StudentKey = "gender" | "name" | "hall" | "course" | "dept" | "homeTown";

function rollToYear(roll: string): string {
  //take a student's roll number, and output the batch they were in.
  if (roll[0] === "Y" && roll[1] > "7") {
    return roll.slice(0, 2);
  } else if (roll.slice(0, 2) < "30") {
    return "Y" + roll.slice(0, 2);
  } else return "Other";
}

function check_bacchas(
  bacchas: string | string[],
  students: Student[]
): Student[] {
  if (bacchas === "Not Available" || typeof bacchas === "string") {
    return [];
  } else {
    return students.filter((student) => bacchas.includes(student.rollNo));
  }
}

function check_query(query: Query, students: Student[]): Student[] {
  // Goes through the array of students and selects only those that match the query given.
  // Filtering first on the basis of name (Fuzzy Search)
  let filtered_student = students; // Currently unfiltered

  // Applying fuzzy search on the basis of name
  if (query.name) {
    console.log("here" , query.name)
    const fuse = new Fuse(students, {
      keys: ["name"],
      threshold: 0.2, // Can change to fine tune later
    });
    filtered_student = fuse.search(query.name).map((res) => res.item);
    // Above only checked fuzziness on name, but user might have entered the roll no which wont be in fuzzy of name, so adding the roll no and username

    const lowercased_name = query.name.toLowerCase();
    filtered_student = filtered_student.concat(
      students.filter(
        (s) =>
          s.rollNo.toLowerCase().includes(lowercased_name) || // Roll number
          s.email.toLowerCase().startsWith(lowercased_name) // username
      )
    );
    console.log(filtered_student.length)
    // Above snippet checks if the students include roll no or starts with username and adds it to the filtered array

    filtered_student = Array.from(new Set(filtered_student)); // Removing duplicates by creating a set and then back to array
  }
  return filtered_student.filter((student: Student) => {
    let key: keyof Query;
    let entry = false;
    for (key in query) {
      // The idea here is that if a student DOESN'T satisfy a certain part of the query, we immediately discard them using "return false"
      // at the end, we have a "return true" - so any records that make it to the end of the "gauntlet" are added to the final list.
      if (query[key].length == 0) {
        // Skip any fields that don't have anything in them
        // Skip name key as already taken above
        continue;
      }
      entry = true; //if query is not totally empty, entry is set to true
      if (key === "batch") {
        // special processing for the "batch"/"year" field
        if (!query.batch.includes(rollToYear(student.rollNo))) {
          return false;
        }
      } else if (key === "gender") {
        const student_data = student.gender.toLowerCase();
        const query_data = query.gender.toLowerCase();
        if (!(student_data === query_data)) {
          return false;
        }
      } else if (key === "address") {
        if (
          !student.homeTown.toLowerCase().includes(query.address.toLowerCase())
        )
          return false;
      }
      // TODO: Understand this below filter
      //  else {
      //   //all the other stuff
      //   let key0: Query0 = key[0] as Query0;
      //   if (!query[key].includes(student[key0])) return false; //note that this allows query[key] to be an array - so, if e.g. query is just {i:[1, 2, 3]} it will return the students with roll numbers 1, 2 and 3 - this helps with finding bacchas
      //   // note that because typescript is such a stickler for everything, the above trick is no longer possible without making changes. >:/
      // }
    }
    return entry; //if query is totally empty, this will be false - otherwise it will be true
  });
}

export { rollToYear, check_bacchas, check_query, type StudentKey };
