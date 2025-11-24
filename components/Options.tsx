import React, { useState, useCallback, useEffect, forwardRef } from "react";
import { Grid, InputLabel, TextField, Select, MenuItem, Paper, FormControl, InputAdornment, IconButton } from "@mui/material";
import { ClearRounded } from "@mui/icons-material";
import MultiSelectField from "./msf";
import debounce from "./utils/debounce";
import { Query, Options as OptionsType } from "./types";

/* options to include:
Year
Gender - simple option menu
Hall
Programme
Dept.
Blood grp.
Hometown - text
Name/username/rollno. - text
Non-text are checkbox option menus
*/

/*MUI:
checkbox option menus: checkmark select
simple option menus: select
rest: text field
*/

interface OptionsProps {
	sendQuery: Function;
	listOpts: OptionsType;
	loading: boolean;
}



function PreOptions (props: OptionsProps, ref: any) {
// 	const [listOpts, setOpts]:[OptionsType, Function]= useState({
// 		batch:[],
// 		hall:[],
// 		prog:[],
// 		dept:[],
// 		bloodgrp:[]
// 	});

	const [query, setQuery] = useState<Query>({
		gender: "",
		name: "",
		batch: [],
		hall: [],
		prog: [],
		dept: [],
		bloodgrp: [],
		address: ""
	});

	// Create a debounced version of sendQuery that persists across renders
	const debouncedSendQuery = useCallback(
		debounce((q: Query) => {
			props.sendQuery(q);
		}, 300),
		[props.sendQuery]
	);
	
	// Execute debounced query whenever query state changes
	useEffect(() => {
		debouncedSendQuery(query);
	}, [query, debouncedSendQuery]);
	
	return (
		<Paper className="options">
			<Grid container rowSpacing={4} columnSpacing={4} sx={{width:"100%"}}>
			<Grid item xs={12} sm={6} md={4}>
				<MultiSelectField 
					disabled={props.loading} 
					query={query}
					name="batch"
					options={props.listOpts.batch}
					setQuery={setQuery}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<div className="field">
				<FormControl variant="filled" disabled={props.loading} sx={{width:"100%"}}>
					<InputLabel id="gender-label">Gender</InputLabel>
					<Select
						className="field"
						labelId="gender-label"
						value={query.gender}
						onChange={(event) => {
							setQuery({...query, gender:event.target.value});
						}}
					>
						<MenuItem value="">Any</MenuItem>
						<MenuItem value="F">Female</MenuItem>
						<MenuItem value="M">Male</MenuItem>
					</Select>
				</FormControl>
				</div>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<MultiSelectField 
					disabled={props.loading} 
					query={query}
					name="hall"
					options={props.listOpts.hall}
					setQuery={setQuery}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<MultiSelectField 
					disabled={props.loading} 
					query={query}
					name="prog"
					label="Programme"
					options={props.listOpts.prog}
					setQuery={setQuery}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<MultiSelectField 
					disabled={props.loading} 
					query={query}
					name="dept"
					label="Department"
					options={props.listOpts.dept}
					setQuery={setQuery}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<MultiSelectField 
					disabled={props.loading} 
					query={query}
					name="bloodgrp"
					label="Blood group"
					options={props.listOpts.bloodgrp}
					setQuery={setQuery}
				/>
			</Grid>
			<Grid item xs={12}>
				<div style={{margin:"auto", width:"fit-content"}}>
				<FormControl variant="filled" disabled={props.loading}>
					<TextField
						disabled={props.loading}
						className="field home"
						label="Hometown"
						value={query.address}
						onChange={(event) => {
							setQuery({...query, address:event.target.value});
// 							newsendQuery(Object.assign(query,{address:event.target.value}));
						}}
					/>
				</FormControl>
				</div>
			</Grid>
			<Grid item xs={12}>
			<FormControl variant="filled" disabled={props.loading} style={{width:"100%"}}>
				<TextField
					disabled={props.loading}
					className="field main-text"
					label="Enter name, username or roll no."
					value={query.name}
					InputProps={{
						endAdornment:(<InputAdornment position="end">
							<IconButton 
								disabled={query.name.length === 0}
								onClick={() => {
									setQuery({...query, name:""});
// 									newsendQuery({...query, name:""});
								}}
							>
								<ClearRounded />
							</IconButton>
						</InputAdornment>),
					}}
					onChange={(event) => {
						setQuery({...query, name:event.target.value});
// 						newsendQuery({...query, name:event.target.value});
					}}
					inputRef={ref}
					autoFocus
				/>
			</FormControl>
			</Grid>
			</Grid>
		</Paper>);
}

const Options = forwardRef(PreOptions);

export default Options;
