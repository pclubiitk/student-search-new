//common types

export interface Student {
	a: string; //address
	b: string; //blood group
	d: string; //department
	g: string; //gender
	h: string; //hall of residence
	i: string; //roll number
	n: string; //full name
	p: string; //programme
	r: string; //room number
	u: string; //username
	s: string; //roll number of baapu/amma
	c: Array<string> | string; //array containing roll numbers of bacchas (or the words "not available")
}

// export interface Student {
// 	address: string; 	// a
// 	bloodgrp: string; 	// b
// 	dept: string;  		// d
// 	gender: string; 	// g
// 	hall: string;  		// h 
// 	rollno: string;  	// i
// 	name: string;  		// n
// 	prog: string;  		// p 
// 	roomno: string;  	// r
// 	username: string; 	// u
// 	sg_rollno: string;  // s
// 	bc_rollnos: Array<string> | string; // c 
// }



export interface Query {
	gender: string;
	name: string;
	batch: Array<string>;
	hall: Array<string>;
	prog: Array<string>;
	dept: Array<string>;
	bloodgrp: Array<string>;
	address: string;
}

export interface Options {//type declaration
	 batch: Array<string>;
	 hall: Array<string>;
	 prog: Array<string>;
	 dept: Array<string>;
	 bloodgrp: Array<string>
}