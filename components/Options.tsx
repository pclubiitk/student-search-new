import React, { useState, useCallback, useEffect, forwardRef } from "react";
import { Grid, InputLabel, TextField, Select, MenuItem, Paper, FormControl, InputAdornment, IconButton } from "@mui/material";
import { ClearRounded } from "@mui/icons-material";
import MultiSelectField from "./msf";
import debounce from "./utils/debounce";
import { Query, Options as OptionsType } from "./types";

/**
 * Props for the Options component
 */
interface OptionsProps {
	/** Function to send search query to parent component */
	sendQuery: (query: Query) => void;
	/** Available filter options populated from student data */
	listOpts: OptionsType;
	/** Whether data is currently loading */
	loading: boolean;
}

/**
 * Options Component (Internal)
 * 
 * Provides search filters including:
 * - Batch/Year (multi-select)
 * - Gender (single select)
 * - Hall of Residence (multi-select)
 * - Programme (multi-select)
 * - Department (multi-select)
 * - Blood Group (multi-select)
 * - Hometown (text search)
 * - Name/Username/Roll Number (text search with autocomplete)
 * 
 * Search queries are debounced to reduce unnecessary updates.
 * 
 * @component
 */
function PreOptions(props: OptionsProps, ref: any) {

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
							setQuery({ ...query, address: event.target.value });
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
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									disabled={query.name.length === 0}
									onClick={() => {
										setQuery({ ...query, name: "" });
									}}
								>
									<ClearRounded />
								</IconButton>
							</InputAdornment>
						),
					}}
					onChange={(event) => {
						setQuery({ ...query, name: event.target.value });
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
