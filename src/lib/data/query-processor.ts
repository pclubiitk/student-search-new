import { Student, Query } from "@/lib/types/data";

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
  //goes through the array of students and selects only those that match the query given.

  return students.filter((student: Student) => {
    let entry = false;
    for (const key in query) {
      const queryKey = key as keyof Query;
      // the idea here is that if a student DOESN'T satisfy a certain part of the query, we immediately discard them using "return false"
      // at the end, we have a "return true" - so any records that make it to the end of the "gauntlet" are added to the final list.
      const queryValue = query[queryKey];
      if (Array.isArray(queryValue) && queryValue.length === 0) {
        //skip any fields that don't have anything in them
        continue;
      }
      if (typeof queryValue === "string" && queryValue.length === 0) {
        continue;
      }
      entry = true; //if query is not totally empty, entry is set to true
      if (queryKey === "name") {
        // special processing for the "name" field
        // we can't match the name to the student's username or roll number right now because it could still match their real name - so we can't just immediately put "return false" if it doesn't match, and we can't just put "return true" if it does match because the student may not match the criteria in other fields.
        // so, we have to check this at the end.
        // so, we check if the name matches the student's full name first.

        let partsOfQueryName = query.name.toLowerCase().split(/\s+/);
        let lastPartOfQN: string = partsOfQueryName.pop()!;
        let partsOfStudentName = student.name.toLowerCase().split(/\s+/);
        let test1 = true;

        // each part of the name in the query must match to exactly one part of the name of the student, and vice versa
        // so, we go through each part in partsOfQueryName, and we go through each part in partsOfStudentName - if they match, we remove that part in partsOfStudentName, and we move on
        // if a part in partsOfQueryName DOESN'T match any part of the student's name, we leave the for loop, and go on to check if the name in the query matches the student's username or roll number

        for (const queryPart of partsOfQueryName) {
          let test2 = false;
          for (const studentPart of partsOfStudentName) {
            if (studentPart === queryPart) {
              let index = partsOfStudentName.indexOf(studentPart);
              partsOfStudentName.splice(index, 1);
              test2 = true; //found a match for this part, so let's exit the loop so we can move onto the next part
              break;
            }
          }
          if (!test2) {
            //if we went through the all partsOfStudentName without finding a match, stop checking for these parts and move straight to checking username/roll number.
            test1 = false;
            break;
          }
        }

        if (test1) {
          // if test1 is not yet false, this means that all other parts of the name entered have matched with a part in the student's name.
          // all that's left is to check the final part of the student name - which can be incomplete, so we use startsWith instead of equals.
          let test2 = false;
          for (const part of partsOfStudentName) {
            if (part.startsWith(lastPartOfQN)) {
              test2 = true;
              break;
            }
          }
          if (!test2) {
            test1 = false;
          }
        }

        //now that we've checked the name completely, we just need to check if the queried name matches the username/roll number if it hasn't matched the name.
        if (!test1) {
          const lowercased_name = query.name.toLowerCase();
          if (
            !student.rollNo.includes(lowercased_name) &&
            !student.email.startsWith(lowercased_name)
          ) {
            return false;
          }
        } //if the name doesn't match EITHER, then we discard that student's record.
      } else if (queryKey === "batch") {
        // special processing for the "batch"/"year" field
        if (!query.batch.includes(rollToYear(student.rollNo))) {
          return false;
        }
      } else if (queryKey === "gender") {
        const student_data = student.gender.toLowerCase();
        const query_data = query.gender.toLowerCase();
        if (!(student_data === query_data)) {
          return false;
        }
      } else if (queryKey === "address") {
        if (
          !student.homeTown.toLowerCase().includes(query.address.toLowerCase())
        ) {
          return false;
        }
      } else {
        //all the other stuff
        const key0 = queryKey[0] as StudentKey;
        const studentValue = student[key0 as keyof Student] as string;
        const queryArray = query[queryKey] as string[];
        if (!queryArray.includes(studentValue)) {
          return false;
        }
      }
    }
    return entry; //if query is totally empty, this will be false - otherwise it will be true
  });
}

export { rollToYear, check_bacchas, check_query, type StudentKey };
