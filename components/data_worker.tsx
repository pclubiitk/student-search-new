/**
 * Data Worker Module
 * 
 * Handles fetching, caching, and querying student data from MongoDB and IndexedDB.
 * This module manages:
 * - Fetching student data from MongoDB Atlas
 * - Caching data locally using IndexedDB for offline access
 * - Processing search queries to filter student records
 * - Building filter options from available data
 */

import { Student, Query, Options } from "./types";

/**
 * Configuration for MongoDB Atlas connection
 * Note: These values should be loaded from environment variables in production
 */
const config = {
	APP_ID: "",
	API_KEY: "",
	cluster_name: "",
	db_name: "",
	collection_name: ""
};

// Global state for student data
let students: Student[] = [];
let new_students: Student[] | undefined = undefined;

/** Available filter options populated from student data */
const options: Options = {
	batch: [],
	hall: [],
	prog: [],
	dept: [],
	bloodgrp: []
};

/** Reference to the IndexedDB instance for local storage */
let db: IDBDatabase | null = null;

/** Cache refresh interval: 1 week in milliseconds */
const CACHE_REFRESH_INTERVAL = 1000 * 60 * 60 * 24 * 7;

/**
 * Fetches student data from MongoDB Atlas API
 * 
 * @throws {Error} If access token is undefined or student data fetch fails
 * @returns {Promise<Student[]>} Array of student records
 */
async function fetch_student_data(): Promise<Student[]> {
	console.log("Sending access token request...");

	try {
		// Step 1: Authenticate with MongoDB Atlas
		const authResponse = await fetch(
			`https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/${config.APP_ID}/auth/providers/api-key/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					key: config.API_KEY
				})
			}
		);

		const authData = await authResponse.json();
		const access_token = authData.access_token;

		if (!access_token) {
			throw new Error("Access token undefined - authentication failed");
		}

		console.log("Access token received successfully");

		// Step 2: Fetch student data using the access token
		const dataResponse = await fetch(
			`https://ap-south-1.aws.data.mongodb-api.com/app/${config.APP_ID}/endpoint/data/v1/action/find`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${access_token}`,
				},
				body: JSON.stringify({
					dataSource: config.cluster_name,
					database: config.db_name,
					collection: config.collection_name,
					filter: {},
					limit: 30000
				})
			}
		);

		const result = await dataResponse.json();
		const student_data = result.documents;

		if (!Array.isArray(student_data)) {
			throw new Error("Student data is not in expected format");
		}

		return student_data;
	} catch (error) {
		console.error("Failed to fetch student data:", error);
		throw error;
	}
}


/**
 * Initializes the IndexedDB database for local storage
 * Sets up object stores and handles version upgrades
 * 
 * @returns {Promise<string>} Resolves with "Success" when database is ready
 * @throws {string} Rejects with error message if database fails to open
 */
async function start_IDB(): Promise<string> {
	return new Promise((resolve, reject) => {
		db = null;

		try {
			const openRequest = indexedDB.open("students", 3);

			openRequest.addEventListener("error", () => {
				console.error("Failed to access local database.");
				reject("Failed to access local database.");
			}, { once: true });

			openRequest.addEventListener("success", () => {
				db = openRequest.result;
				resolve("Success");
			}, { once: true });

			openRequest.addEventListener("upgradeneeded", (event) => {
				const database = (event.target as IDBOpenDBRequest).result;
				db = database;

				// Delete old object store if it exists (for migration)
				try {
					if (database.objectStoreNames.contains("students")) {
						database.deleteObjectStore("students");
						console.log("Deleted old students table for schema upgrade");
					}
				} catch (err) {
					console.error("Error deleting old students table:", err);
				}

				// Create new object store
				const objStore = database.createObjectStore("students", {
					keyPath: "key",
					autoIncrement: false
				});

				// Create index for student data
				objStore.createIndex("students", "students", { unique: false });
			}, { once: true });
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Retrieves the timestamp of the last data update from IndexedDB
 * 
 * @returns {Promise<number>} Timestamp in milliseconds, or 0 if not found or on error
 */
async function get_time_IDB(): Promise<number> {
	return new Promise(async (resolve) => {
		try {
			await start_IDB();

			if (!db) {
				resolve(0);
				return;
			}

			const req = db
				.transaction(["students"], "readonly")
				.objectStore("students")
				.get(2);

			req.onerror = () => {
				resolve(0);
			};

			req.onsuccess = () => {
				if (!req.result) {
					resolve(0);
				} else {
					resolve(req.result.time);
				}
			};
		} catch (error) {
			console.error("Error getting timestamp from IndexedDB:", error);
			resolve(0);
		}
	});
}

/**
 * Updates IndexedDB with new student data
 * Clears existing data and stores the new dataset with current timestamp
 * 
 * @param {Student[]} students - Array of student records to store
 * @returns {Promise<string>} Resolves with "Success" when update is complete
 * @throws {any} Rejects with error if update fails
 */
async function update_IDB(students: Student[]): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			await start_IDB();

			if (!db) {
				reject("Database not initialized");
				return;
			}

			// Use a single transaction to clear and update data atomically
			const trxn = db.transaction(["students"], "readwrite");
			const objectStore = trxn.objectStore("students");

			// Clear existing data
			objectStore.openCursor().onsuccess = (event) => {
				const cursor = (event.target as IDBRequest).result;
				if (cursor) {
					objectStore.delete(cursor.value.key);
					cursor.continue();
				} else {
					// All entries deleted, now add new data
					objectStore.add({ students: students, key: 1 });
					objectStore.add({ time: Date.now(), key: 2 });
				}
			};

			trxn.oncomplete = () => {
				console.log("Student data successfully saved locally.");
				resolve("Success");
			};

			trxn.onerror = () => {
				console.error("Failed to update local database");
				reject(trxn.error);
			};
		} catch (error) {
			console.error("Error updating IndexedDB:", error);
			reject(error);
		}
	});
}

/**
 * Retrieves student data from IndexedDB local cache
 * 
 * @returns {Promise<Student[]>} Array of cached student records
 * @throws {string} Rejects if no data found or data is corrupted
 */
async function check_IDB(): Promise<Student[]> {
	return new Promise(async (resolve, reject) => {
		try {
			await start_IDB();

			if (!db) {
				reject("Database not initialized");
				return;
			}

			const req = db
				.transaction(["students"], "readonly")
				.objectStore("students")
				.get(1);

			req.onerror = () => {
				reject("Error reading from IndexedDB");
			};

			req.onsuccess = () => {
				if (!req.result) {
					reject("No cached data found");
					return;
				}

				if (!Array.isArray(req.result.students)) {
					reject("Cached data is corrupted");
					return;
				}

				resolve(req.result.students);
			};
		} catch (error) {
			console.error("Error checking IndexedDB:", error);
			reject(error);
		}
	});
}

/**
 * Prepares the worker by building filter options from student data
 * and setting up message handlers for queries
 */
function prepare_worker(): void {
	// Build filter options from student data
	for (const student of students) {
		// Extract unique values for each filter category
		for (const key in options) {
			const optionKey = key as keyof Options;

			if (optionKey === "batch") {
				const batch = rollToYear(student.i);
				if (!options.batch.includes(batch)) {
					options.batch.push(batch);
				}
			} else {
				// Map option keys to student property keys
				const studentKey = optionKey[0] as "h" | "p" | "d" | "b";
				const value = student[studentKey];

				if (!options[optionKey].includes(value)) {
					options[optionKey].push(value);
				}
			}
		}
	}

	// Sort all option arrays alphabetically
	for (const key in options) {
		const optionKey = key as keyof Options;
		options[optionKey].sort();
	}

	// Set up message handler for worker communication
	onmessage = function (event) {
		const data = event.data;

		if (data === "ready?") {
			// Respond to readiness check
			postMessage("Worker ready");
		} else if (data === "Options") {
			// Send filter options to client
			postMessage(["Options", options]);
		} else if (Array.isArray(data)) {
			// Handle family tree request: ["ft", student]
			const student = data[1] as Student;
			const baapu = students.find((st: Student) => st.i === student.s);
			const bacchas = check_bacchas(student.c);
			postMessage(["ft", [baapu, student, bacchas]]);
		} else {
			// Handle search query
			const results = check_query(data as Query);
			postMessage(["query", results]);
		}
	};

	console.log("Worker ready");
	postMessage("Worker ready");
	postMessage(["Options", options]);
}

/**
 * Initialize the worker on module load
 * Attempts to load cached data first, then fetches fresh data if needed
 */
(async function initializeWorker() {
	let noLocalData = false;
	let cantGetData = false;
	let lastUpdateTime = 0;

	// Attempt to load cached data from IndexedDB
	try {
		console.log("Loading cached data from IndexedDB...");
		students = await check_IDB();
		lastUpdateTime = await get_time_IDB();
		console.log(`Data last updated: ${new Date(lastUpdateTime).toLocaleString()}`);
		console.log("Preparing worker with cached data...");
		prepare_worker();
	} catch (error) {
		console.error("Failed to load cached data:", error);
		noLocalData = true;
	}

	// Refresh data if cache is stale or missing
	const cacheIsStale = Date.now() - lastUpdateTime > CACHE_REFRESH_INTERVAL;
	if (noLocalData || cacheIsStale) {
		try {
			console.log("Fetching fresh data from API...");
			new_students = await fetch_student_data();

			if (!new_students) {
				throw new Error("Failed to fetch student data from API");
			}

			console.log("Updating local cache with fresh data...");
			await update_IDB(new_students);

			// Re-prepare worker with fresh data
			console.log("Re-initializing worker with fresh data...");
			students = new_students;
			prepare_worker();
		} catch (error) {
			console.error("Failed to fetch and cache fresh data:", error);
			cantGetData = true;
		}
	}

	// Fatal error: no local data and unable to fetch
	if (noLocalData && cantGetData) {
		postMessage("Error");
		console.error("Unable to load or fetch student data. Application cannot function.");
	}
})();



/** Type alias for student property keys used in queries */
type StudentPropertyKey = "g" | "n" | "h" | "p" | "d" | "b" | "a";

/**
 * Extracts the batch year from a student's roll number
 * 
 * @param {string} roll - Student roll number
 * @returns {string} Batch year (e.g., "Y18", "Y20") or "Other"
 * 
 * @example
 * rollToYear("Y18123") // returns "Y18"
 * rollToYear("200123") // returns "Y20"
 */
function rollToYear(roll: string): string {
	// Handle Y-prefixed roll numbers (newer format)
	if (roll[0] === "Y" && roll[1] > "7") {
		return roll.slice(0, 2);
	}

	// Handle numeric roll numbers (older format)
	if (roll.slice(0, 2) < "30") {
		return "Y" + roll.slice(0, 2);
	}

	return "Other";
}

/**
 * Retrieves student records for a list of mentees (bacchas)
 * 
 * @param {string | string[]} bacchas - "Not Available" or array of roll numbers
 * @returns {Student[]} Array of student objects for the mentees
 */
function check_bacchas(bacchas: "Not Available" | string[]): Student[] {
	if (bacchas === "Not Available") {
		return [];
	}

	return students.filter((student) => bacchas.includes(student.i));
}

/**
 * Checks if a student's name matches the search query
 * Supports partial word matching and username/roll number search
 * 
 * @param {Student} student - Student to check
 * @param {string} queryName - Search string
 * @returns {boolean} True if student matches the name query
 */
function matchesName(student: Student, queryName: string): boolean {
	const lowerQueryName = queryName.toLowerCase();
	const queryParts = lowerQueryName.split(/\s+/);
	const lastQueryPart = queryParts.pop()!;
	const studentNameParts = student.n.toLowerCase().split(/\s+/);

	// Try to match all complete word parts
	let allPartsMatch = true;
	const remainingStudentParts = [...studentNameParts];

	for (const queryPart of queryParts) {
		const matchIndex = remainingStudentParts.indexOf(queryPart);
		if (matchIndex === -1) {
			allPartsMatch = false;
			break;
		}
		remainingStudentParts.splice(matchIndex, 1);
	}

	// Check if the last part matches any remaining student name part (prefix match)
	if (allPartsMatch) {
		const hasPartialMatch = remainingStudentParts.some(part =>
			part.startsWith(lastQueryPart)
		);
		if (hasPartialMatch) {
			return true;
		}
	}

	// Fallback: check username and roll number
	return (
		student.i.toLowerCase().includes(lowerQueryName) ||
		student.u.toLowerCase().startsWith(lowerQueryName)
	);
}

/**
 * Filters students based on search query criteria
 * 
 * Supports multi-field search including:
 * - Name (partial match with word-by-word matching)
 * - Username and roll number (prefix/substring match)
 * - Batch year, hall, program, department, blood group (exact match)
 * - Address (substring match)
 * 
 * @param {Query} query - Search criteria
 * @returns {Student[]} Filtered array of students matching all criteria
 */
function check_query(query: Query): Student[] {
	return students.filter((student: Student) => {
		let hasNonEmptyCriteria = false;

		// Check each query field
		for (const key in query) {
			const queryKey = key as keyof Query;
			const queryValue = query[queryKey];

			// Skip empty query fields
			if (!queryValue || (Array.isArray(queryValue) && queryValue.length === 0)) {
				continue;
			}

			hasNonEmptyCriteria = true;

			// Handle name search with flexible matching
			if (queryKey === "name") {
				if (!matchesName(student, query.name)) {
					return false;
				}
			}
			// Handle batch/year filtering
			else if (queryKey === "batch") {
				if (!query.batch.includes(rollToYear(student.i))) {
					return false;
				}
			}
			// Handle gender filtering
			else if (queryKey === "gender") {
				if (student.g.toLowerCase() !== query.gender.toLowerCase()) {
					return false;
				}
			}
			// Handle address/hometown filtering
			else if (queryKey === "address") {
				if (!student.a.toLowerCase().includes(query.address.toLowerCase())) {
					return false;
				}
			}
			// Handle hall, program, department, blood group filtering
			else {
				const studentKey = queryKey[0] as StudentPropertyKey;
				const studentValue = student[studentKey];
				const queryArray = query[queryKey] as string[];

				if (!queryArray.includes(studentValue)) {
					return false;
				}
			}
		}

		// Return false if query is completely empty
		return hasNonEmptyCriteria;
	});
}