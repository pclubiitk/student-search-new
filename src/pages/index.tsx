import Options from "@/components/ui/Options";
import Display from "@/components/ui/Display";
import Overlay from "@/components/ui/Overlay";
import ReactDOM from 'react-dom/client';
import React, {useState, useEffect, useRef} from "react";
import {ThemeProvider,createTheme} from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {DarkModeSharp, LightModeRounded, HelpOutlineRounded, MailOutlineRounded} from "@mui/icons-material";
// import {students as STUDENTS, rollToYear} from "../components/student_data_getter.tsx";
import TreeCard from "@/components/student/treeSCard";
import SCard from "@/components/ui/SCard";
import {Student as StudentType, Query as QueryType, Options as OptType} from "@/lib/types/data";
import GuestFooter from "@/components/student/Treefooter";

//start shared search worker
if (!(typeof window === "undefined") && window.Worker) {//only on the client, TODO: find better method - do when dealing w/ SSG
	var searcher = new Worker(new URL("../components/data_worker", import.meta.url));
}

const isIFrame = (typeof window !== "undefined") && (window.top === window.self);

export default function Home(props: Object) {

	const [students, setStudents]:[Array<StudentType>, Function] = useState([]);
	const [darkMode, setDarkMode]=useState(true);
	//initial render doesn't have access to localStorage so start off with true
	const [currDisp, setCurr]:[any, Function] = useState();
	const [loading, setLoading] = useState(true); //loading at the start
	const [listOpts, setOpts]:[OptType, Function] = useState({
		batch:["Loading..."],
		hall:["Loading..."],
		prog:["Loading..."],
		dept:["Loading..."],
		bloodgrp:["Loading..."]
	});
	const [iFrame, setIFrame] = useState(false);
	const searchBar = useRef<HTMLInputElement>(null);
	
	function queryHandler(event: any) {
//		console.log("Query result received");
		if (event.data[0] == "query") {
			setStudents(event.data[1].toSorted((a:StudentType, b:StudentType) => {
				try {
					return (Number(a.i) > Number(b.i));
				} catch (err) {
					return (a.i > b.i);
				}
			}));
// 			setLoading(false);
		}
	}
	
	function treeHandler(event: any) {
//		console.log("Tree result received");
		if (event.data[0] == "ft") {
// 			document.body.style.overflow = "hidden"; //hotfix
			let [baapu, student, bacchas] = event.data[1];
			setCurr([
			<TreeCard
				key="open"
				data={student}
				baapu={baapu /*TreeCard'll handle undefined*/}
				bacchas={bacchas}
				displayCard={displayCard}
				clearOverlay={clearOverlay}
			/>,
			<div className="footer-absolute" key="footer">
				<GuestFooter />
			</div>
			]);
		}
		
	}
	
	function optsHandler(event: any) {
		if (event.data[0] == "Options") {
			setOpts(event.data[1]);
		}
	}
	
	function errorHandler(event: any) {
		if (event.data === "Error") {
			displayElement(
				<Card><h1>Data could not be retrieved locally nor fetched.</h1>
				<h2 >Please access the website from campus or via VPN once so that student data can be downloaded and stored.</h2>
				<p>Check the console for more details.</p></Card>
			);
		}
	}
	
	useEffect(() => {
		//on mount: set up worker handler, wait for it to initialise, and then:
		//1. get list options from it
		//2. set up the handlers for query and treecard
//		console.log("waiting for worker");
		searcher.postMessage("ready?");
		searcher.onmessage = null;
		searcher.onmessage = (event) => {
			if (event.data !== "Worker ready") {
				//error condition
				errorHandler({data: "Error"});
			} else {
				searcher.onmessage = (event) => {
					if (event.data[0] != "Options") return;
					setLoading(false);
					setTimeout(() => {
						if (searchBar.current) {
							// console.log("focusing search bar");
							searchBar.current.focus();
						}
					}, 0); //I don't know why but it just won't focus without a timeout
					setOpts(event.data[1]);
					searcher.onmessage = null; //remove this event handler
					searcher.addEventListener("message", queryHandler);
					searcher.addEventListener("message",treeHandler);
					searcher.addEventListener("message", optsHandler); //when web worker updates, it will send out options again
					searcher.addEventListener("message", errorHandler);
				   
				};
				searcher.postMessage("Options");
			}
		};
		return (() => {searcher.onmessage = null;}); //on unmount: remove all handlers
	},[])
	
	useEffect(() => {
		setDarkMode(localStorage.getItem("darkmode") !== "false")
	},[]);
	//on mount: load darkmode setting
	
	useEffect(() => {
		setIFrame(!isIFrame);
	}, []);
	//on mount: load the iframe stopper, need to do it this way so that static generation generates the page normally (isIFrame is false when building because typeof window is "undefined" then) but if the page is indeed an iframe, the app stops working
	//can't stop iframes the normal way (setting HTTP header to disallow them) because github pages doesn't allow you to set HTTP headers :(
	
	const keydownfxn = (e: any) => {
		if (e.key === "/" && searchBar.current && document.activeElement != searchBar.current) {
			e.preventDefault();
			searchBar.current.focus();
		} else if (e.key === "Escape" && document.activeElement && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	};
	
	useEffect(() => {
		document.addEventListener("keydown", keydownfxn);
		return () => {document.removeEventListener("keydown", keydownfxn)}
	}, [])
	//on mount: add / button detection to move focus to search bar
	
	useEffect(() => {
		if (darkMode) {
			document.body.style.backgroundColor = "#000";
		} else {
			document.body.style.backgroundColor = "#efefef";
		}
	},[darkMode]);
	
	
	const sendQuery = (query: QueryType)=> {
		searcher.postMessage(query);
//		console.log(query);
// 		setLoading(true);
// 		if (!workerReady) return [];
		
	}

	const clearOverlay = ()=> {
		setCurr(undefined);
// 		document.body.style.overflow = "auto"; //hotfix
	}
	
	const displayElement = (element: any) => {
		clearOverlay();
		setCurr([element]);
// 		document.body.style.overflow = "hidden"; //hotfix
	}
	
	const displayCard = (student: StudentType) =>{
		clearOverlay();
// 		document.body.style.overflow = "hidden"; //hotfix
		setCurr([<SCard
			compact={false}
			data={student}
			key="closed"
		>
		<Button
			onClick={() => {displayTree(student);}}
		>Open Family Tree</Button>
		</SCard>]);
	}
	
	const displayTree = (student: StudentType) => {
		clearOverlay();
		// if (!workerReady) return;
		searcher.postMessage(["ft", student]);
	}
  
  	if (!iFrame) return (
    <div>
    <ThemeProvider theme={darkMode 
			? createTheme({
				palette:{
					mode: "dark",
				}
			})
			: createTheme({
				
			})
  	}>
  	<div 
  		className="buttons"
  		style={{
  			zIndex:"9999"
  		}}
  	>
		<Fab
		  onClick={()=>{
					setDarkMode(!darkMode);
					localStorage.setItem("darkmode", String(!darkMode));}}
		>
		{darkMode ?
				<LightModeRounded />
				: <DarkModeSharp />}
		</Fab>
		<Fab
			onClick={() => {
				displayElement(
					<Card
						style={{
							padding:"10px"
						}}
					>
						<h1>Setting a custom DP</h1>
						<p>You can customise the image shown here by placing a custom image in your iitk webhome folder called dp.jpg/dp.png such that going to http://home.iitk.ac.in/~yourusername/dp opens up that particular picture.</p>
						<h1>How do I update the data shown here?</h1>
						<p>{`The data here is scraped from the Office Automation Portal. The data there can be updated via the Login Based Services > Student Profile > PI form . If you have had a branch change, please go to the ID Cell and update your ID Card to update your branch.`}</p>
						<p>The changes if any will be reflected in about a week. </p>
						<h1>{`I can't see students' pictures/I can't access student data.`}</h1>
						<p>{`Access to student data is restricted to those currently on campus or connecting via VPN. Please visit the website once via either method so that the data can be stored locally. After this, you will be able to access student data from anywhere (as long as you don't wipe your cache or local files).`}</p>
						<h1>Credits</h1>
						<p>Student Search has gone through many iterations over the years. The current one was made by Deven Gangwani and Krishnansh Agrawal (both Y21).The one just before this was made by Yash Srivastav (Y15).</p>
						<p>Credit for Student Guide data (bacche, ammas and baapus) goes to the Counselling Service, IITK.</p>
					</Card>
				);
			}}
		>
			<HelpOutlineRounded />
		</Fab>
		<Fab
			style={{
				display:(students.length < 3000 && students.length > 0 ? "" : "none")
			}}
			onClick={() => {
				displayElement(
					<Card
						style={{
							padding:"10px",
							width:"80vw",
							maxWidth:"1200px",
							maxHeight:"1000px"
						}}
					>
						<p>{`Press the 'copy' button to copy all email addresses.`}</p>
						<div
							style={{
								height:"60vh",
								overflow:"auto"
						}}
						>
						{students.filter((el) => (el.u.length > 0)).map((el) => (el.u + "@iitk.ac.in")).join(", ")}
						</div>
						<Button 
							variant="contained"
							onClick={() => {
								navigator.clipboard.writeText(students.filter((el) => (el.u.length > 0)).map((el) => (el.u + "@iitk.ac.in")).join(", "));
							}}
						>Copy</Button>
					</Card>
				);
			}}
		>
			<MailOutlineRounded />
		</Fab>
    </div>
	<Options
    	sendQuery={sendQuery}
    	listOpts={listOpts}
    	loading={loading}
    	ref={searchBar}
    />
    <br/>
    <Display
    	loading={loading}
    	toShow={students}
    	displayCard={displayCard}
    />
    <Overlay
    	clearOverlay={clearOverlay}
    >
		{currDisp !== undefined
			? currDisp
			: ""}
    </Overlay>
    </ThemeProvider>
    </div>
  ); 
  else return (
  	<div style={{
  		width: "60%",
  		margin:"auto",
  		color:"white"
  	}}><h1>Please view this page at <a href="https://search.pclub.in" target="_blank">search.pclub.in</a></h1>
  	<p>Credits:</p>
  	<p>Deven Gangwani</p>
  	<p>Krishnansh Agarwal</p>
  	<p>Programming Club, IITK</p>
  	</div>
  );
}


