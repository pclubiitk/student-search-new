import Modal from "@mui/material/Modal";
import React, { useState, useEffect, ReactNode } from "react";
import FadeAnimation from "./utils/FadeAnimation";

/**
 * Props for the Overlay component
 */
interface OverlayProps {
	/** Function to clear/close the overlay */
	clearOverlay: () => void;
	/** Content to display in the overlay */
	children?: ReactNode;
}

/**
 * Overlay Component
 * 
 * A modal overlay component that displays content with a fade animation.
 * 
 * @component
 */

export default function Overlay(props: OverlayProps) {
	const [open, setOpen] = useState(false);

	// Open the overlay when children content is provided
	useEffect(() => {
		if (props.children) {
			setOpen(true);
		}
	}, [props.children]);

	const closeModal = () => {
		props.clearOverlay();
		setTimeout(() => {
			setOpen(false);
		}, 300);
	};

	return (
		<Modal
			style={{
				display: "flex",
				overflowY: "scroll",
				scrollBehavior: "smooth",
			}}
			open={open}
			onClick={closeModal}
		>
			<FadeAnimation
				className="overlay"
				appear={open}
			>
				{props.children || null}
			</FadeAnimation>
		</Modal>
	);
}