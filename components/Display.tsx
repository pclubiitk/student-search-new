import Card from "@mui/material/Card";
import SCard from "./SCard";
import React, { useState, useEffect, useCallback } from "react";
import FadeAnimation from "./utils/FadeAnimation";
import { Student } from "./types";

/**
 * Props for the Display component
 */
interface DisplayProps {
	/** Whether data is currently loading */
	loading: boolean;
	/** Array of students to display */
	toShow: Student[];
	/** Function to display detailed student card */
	displayCard: (student: Student) => void;
}

/**
 * Display Component
 * 
 * Shows a list of student cards with infinite scroll functionality.
 * Renders a loading state while data is being fetched.
 * 
 * @component
 */
function Display(props: DisplayProps) {
	const { loading, toShow, displayCard } = props;
	const [pos, setPos] = useState(50);

	// Memoize student cards to avoid unnecessary re-renders
	const students = Array.isArray(toShow)
		? toShow.map((student) => (
				<SCard
					data={student}
					key={student.i}
					onClick={() => displayCard(student)}
					pointer={true}
					compact={true}
				/>
		  ))
		: [];

	// Handle infinite scroll
	const infiniteScrollImplementation = useCallback(() => {
		const { innerHeight } = window;
		const { scrollTop, offsetHeight } = document.documentElement;

		if (innerHeight + scrollTop > offsetHeight - 200) {
			setPos((prevPos) => prevPos + 50);
		}
	}, []);

	// Set up scroll listener
	useEffect(() => {
		window.addEventListener("scroll", infiniteScrollImplementation);
		return () => {
			window.removeEventListener("scroll", infiniteScrollImplementation);
		};
	}, [infiniteScrollImplementation]);

	// Reset position when search results change
	useEffect(() => {
		setPos(50);
	}, [toShow]);

	if (loading) {
		return (
			<div>
				<div id="count">
					<Card>Loading...</Card>
					<div className="loader"></div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div id="count">
				<Card>
					{students.length} {students.length === 1 ? "result" : "results"} found
				</Card>
			</div>
			<FadeAnimation className="display">
				{students.slice(0, pos)}
			</FadeAnimation>
		</div>
	);
}

export default React.memo(Display);
