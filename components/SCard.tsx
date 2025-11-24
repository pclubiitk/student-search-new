import React, { ReactNode, MouseEvent } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Image from "./UserImage";
import { Student } from "./types";
import {
	EmailRounded,
	InvertColorsRounded,
	HomeRounded,
	AccountBalanceRounded,
	Public,
	PeopleOutlineRounded
} from "@mui/icons-material";

/**
 * Props for the SCard (Student Card) component
 */
interface SCardProps {
	/** Student data to display */
	data: Student;
	/** Whether to show pointer cursor on hover */
	pointer?: boolean;
	/** Display mode: false (full), true (compact), or "ultra" (ultra-compact) */
	compact: boolean | "ultra";
	/** Click handler for the card */
	onClick?: (event: MouseEvent) => void;
	/** Optional child elements (typically buttons for full card view) */
	children?: ReactNode;
}

/**
 * SCard (Student Card) Component
 * 
 * Displays student information in three different layouts:
 * - Full: Complete profile with all details
 * - Compact: Medium-sized card with basic info
 * - Ultra-compact: Minimal card for family tree views
 * 
 * @component
 */

const SCard = React.forwardRef((props: SCardProps, ref:any) => {
	switch (props.compact) {
		case 'ultra':
			return (
				<Card
					className="student-card-ultra-compact"
					key={props.data.i}
					ref={ref}
					style={{
						cursor:(props.pointer ? "pointer" : "auto")
					}}
					onClick={(event) => {
						event.stopPropagation();
						if (props.onClick !== undefined) props.onClick(event);
					}}
				>
					<Image style={{width:100, height:100}} u={props.data.u} i={props.data.i} g={props.data.g} alt="Image of student" />
					<div className="data">
						<p>{props.data.n}</p>
						<p>{props.data.i}</p>
						{Array.isArray(props.data.c) && props.data.c.length > 0 && <div style={{
							width: "20px",
							height: "20px"
						}}>
						<PeopleOutlineRounded />
						</div>}
					</div>
					
				</Card>
			);
		case true:
			return (
				<Card
					className="student-card-compact"
					key={props.data.i}
					ref={ref}
					style={{
						cursor:(props.pointer ? "pointer" : "auto"),
					}}
					onClick={(event) => {
						event.stopPropagation();
						if (props.onClick !== undefined) props.onClick(event);
					}}
				>
					<Image style={{width:150, height:150}} u={props.data.u} i={props.data.i} g={props.data.g} alt="Image of student" />
					<div className="data">
						<p>{props.data.n}</p>
						<p>{props.data.d}</p>
						<p>{props.data.i}</p>
					</div>	
				</Card>
			);
		case false:
			return (
				<Card
				className="student-card"
				key={props.data.i}
				ref={ref}
				style={{
					cursor:(props.pointer ? "pointer" : "auto"),
				}}
				onClick={(event) => {
					event.stopPropagation();
					if (props.onClick !== undefined) props.onClick(event);
				}}
				>
					<Image style={{width:200, height:200}} u={props.data.u} i={props.data.i} g={props.data.g} alt="Image of student" />
					<p className="name">{props.data.n}</p>
					<p className="roll">{props.data.i}</p>
					<p className="dept">{props.data.p}, {props.data.d}</p>
					<div className="more-data">
					<div><AccountBalanceRounded /><p>{props.data.r.length > 0 ? props.data.r + ", " : ""} {props.data.h}</p></div>
					<div><HomeRounded /><p>{props.data.a}</p></div>
					<div><InvertColorsRounded /><p>{props.data.b}</p></div>
					{(props.data.u.length > 0 )? <div><EmailRounded /><p><a href={`mailto:${props.data.u}@iitk.ac.in`}>{props.data.u}@iitk.ac.in</a></p></div> : ""}
					</div>
					<a href={`https://home.iitk.ac.in/~${props.data.u}`} target="_blank"><Button style={{flexDirection:"column"}}><Public /><br /><div>Visit Homepage</div></Button></a>
					{props.children}
				</Card>
			);
	}
});

SCard.displayName = "Student Card";

export default SCard;
