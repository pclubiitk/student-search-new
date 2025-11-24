import React from "react";
import SCard from "./SCard";
import Card from "@mui/material/Card";
import { Student } from "./types";

/**
 * Props for the TreeCard component
 */
interface TreeCardProps {
	/** Parent mentor (baapu/amma) student data */
	baapu?: Student;
	/** Array of mentee (baccha) student data */
	bacchas: Student[];
	/** Current student data */
	data: Student;
	/** Function to display a student card */
	displayCard: (student: Student) => void;
	/** Optional function to clear overlay */
	clearOverlay?: () => void;
}

/**
 * TreeCard Component
 * 
 * Displays a student's family tree showing their mentor and mentees.
 * 
 * @component
 */

function TreeCard(props: TreeCardProps) {
	const { baapu, bacchas, data, displayCard } = props;

	const handleBaapuClick = () => {
		if (baapu) {
			// Smoothly scroll to top of modal
			const modal = document.getElementsByClassName("MuiModal-root")[0];
			if (modal) {
				modal.scrollTo(0, 0);
			}
			displayCard(baapu);
		}
	};

	return (
		<div className="tree-view">
			{baapu !== undefined ? (
				<SCard
					pointer={true}
					compact={"ultra"}
					data={baapu}
					onClick={handleBaapuClick}
				/>
			) : (
				<Card>Not Available :(</Card>
			)}
			<SCard
				pointer={true}
				compact={true}
				data={data}
				onClick={() => {
					displayCard(data);
				}}
			/>
			<div className="bacchas">
				{bacchas.length > 0 ? (
					bacchas.map((baccha) => {
						const handleBacchaClick = () => {
							// Smoothly scroll to top of modal
							const modal = document.getElementsByClassName("MuiModal-root")[0];
							if (modal) {
								modal.scrollTo(0, 0);
							}
							displayCard(baccha);
						};

						return (
							<SCard
								pointer={true}
								compact={"ultra"}
								data={baccha}
								key={baccha.i}
								onClick={handleBacchaClick}
							/>
						);
					})
				) : null}
			</div>
		</div>
	);
}

export default TreeCard;
