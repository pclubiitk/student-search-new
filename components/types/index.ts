/**
 * Type definitions for the Student Search application
 * @module types
 */

/**
 * Represents a student record in the database
 * Note: Property names are abbreviated to reduce data transfer size
 */
export interface Student {
	/** Student's home address */
	a: string;
	/** Blood group */
	b: string;
	/** Department */
	d: string;
	/** Gender (M/F) */
	g: string;
	/** Hall of residence */
	h: string;
	/** Roll number (unique identifier) */
	i: string;
	/** Full name */
	n: string;
	/** Programme */
	p: string;
	/** Room number */
	r: string;
	/** Username (for email and homepage) */
	u: string;
	/** Roll number of mentor (baapu/amma) */
	s: string;
	/** Array of mentee roll numbers (bacchas) or "Not Available" string */
	c: Array<string> | string;
}

/**
 * Search query parameters for filtering students
 */
export interface Query {
	/** Filter by gender (M/F or empty for any) */
	gender: string;
	/** Search by name, username, or roll number */
	name: string;
	/** Filter by batch years */
	batch: Array<string>;
	/** Filter by hall of residence */
	hall: Array<string>;
	/** Filter by programme */
	prog: Array<string>;
	/** Filter by department */
	dept: Array<string>;
	/** Filter by blood group */
	bloodgrp: Array<string>;
	/** Filter by hometown/address */
	address: string;
}

/**
 * Available filter options populated from student data
 */
export interface Options {
	/** Available batch years */
	batch: Array<string>;
	/** Available halls of residence */
	hall: Array<string>;
	/** Available programmes */
	prog: Array<string>;
	/** Available departments */
	dept: Array<string>;
	/** Available blood groups */
	bloodgrp: Array<string>;
}