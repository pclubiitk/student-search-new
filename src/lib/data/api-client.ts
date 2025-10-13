import { Student } from "@/lib/types/data";

async function fetch_student_data(): Promise<Student[] | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_SEARCH_URL}/api/search/`;
  // TODO: Make this env variable
  // const apiUrl = "http://localhost:8083/api/search/";
  try {
    const res = await fetch(apiUrl, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Data received:", data);
      // Your original logic was commented out, let's restore it
      const student_data = data.profiles;
      if (!Array.isArray(student_data)) {
        throw new Error("Student data is not an array");
      }
      return student_data as Student[];
    } else {
      postMessage({
        status: "error",
        message: "An error occurred during fetch.",
      });
      throw new Error(`Server responded with status ${res.status}`);
    }
  } catch (err) {
    postMessage({
      status: "error",
      message: "An error occurred during fetch.",
    });
    return null; // Return null if error
  }
}

export { fetch_student_data };
