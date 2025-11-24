import { InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from "@mui/material";
import React from "react";
import { Query } from "./types";

/**
 * Props for the MultiSelectField component
 */
interface MSFProps {
	/** Current query state */
	query: Query;
	/** Function to update query state */
	setQuery: (query: Query) => void;
	/** Name of the query field this component controls */
	name: keyof Query;
	/** Optional custom label (defaults to capitalized field name) */
	label?: string;
	/** Available options for selection */
	options: string[];
	/** Whether the field is disabled */
	disabled: boolean;
}

/**
 * MultiSelectField Component
 * 
 * A reusable multi-select dropdown component for filtering options.
 * 
 * @component
 */
export default function MultiSelectField(props: MSFProps) {
	const { query, setQuery, name, label, options, disabled } = props;
	
	// Generate label: use provided label or capitalize the field name
	const displayLabel = label ?? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

	const handleChange = (event: SelectChangeEvent<string[]>) => {
		setQuery({ ...query, [name]: event.target.value });
	};

	return (
		<div className="field">
			<FormControl variant="filled" disabled={disabled} sx={{ width: "100%" }}>
				<InputLabel id={`${name}-label`}>
					{displayLabel}
				</InputLabel>
				<Select
					labelId={`${name}-label`}
					className="field"
					value={query[name] as string[]}
					multiple
					onChange={handleChange}
				>
					{options.map((option) => (
						<MenuItem value={option} key={option}>
							{option}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
