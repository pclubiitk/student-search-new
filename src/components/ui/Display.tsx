import Card from "@mui/material/Card";
import SCard from "./SCard";
import React, {useState, useEffect} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import FadeAnim from "./fadeAnim";
import {Student } from "./commontypes";

/*
name={el.n}
dept={el.d}
home={el.a}
roll={el.i}
key={el.i}
*/
interface DisplayProps {
	loading: boolean;
	toShow: any[];
	displayCard: Function;
}


function Display(props: DisplayProps) {
	const [pos, setPos] = useState(50);
	
	const students = (typeof props.toShow.map === "function")
		?props.toShow.map(el => {
			return (
				<SCard 
					data={el} 
					key={el.i}
					onClick={() => {props.displayCard(el)}}
					pointer={true}
					compact={true}
				/>
		);})
		: [];
	
	const infiniteScrollImplementation = () =>{
		if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 200) {
			setPos(pos + 50);
		}
	}
	
	useEffect(() => { //the infinite scroll part - changes no. elements displayed if scrolled to the end
		window.addEventListener("scroll", infiniteScrollImplementation);
		return () => {window.removeEventListener("scroll", infiniteScrollImplementation)}
	});
	
	useEffect(() => {setPos(50)},[props.toShow]); //reset pos to 50 if new search (i.e. if new props received)
	
// 	if (props.loading) return (
// 		<FadeAnim myname="display">
// 		<div className="loader"></div>
// 		</FadeAnim>
// 	)
	
	if (props.loading) return (
		<div>
			<div id="count">
				<Card>Loading...</Card>
				<div className="loader"></div>
			</div>
		</div>
	);
	
	return (
		<div>
			<div id="count"><Card>{students.length} {students.length === 1 ? "result" : "results"} found</Card></div>
			<FadeAnim myname="display">
			{students.slice(0,pos)}
			</FadeAnim>	
		</div>);
}

export default Display;
