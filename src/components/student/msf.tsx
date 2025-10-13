import { InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import React, { useCallback } from "react";
import debounce from "@/components/ui/animations/debounce";
import { Query } from "@/lib/types/data";

interface MSFProps {
  query: Query;
  setQuery: Function;
  name: keyof Query;
  label?: string;
  options: any[];
  disabled: boolean;
}

export default function MultiSelectField(props: MSFProps) {
  let querycopy = props.query; //stops trying to assign values to props.query

  const newsetQuery = useCallback(debounce(props.setQuery, 1000), []);

  return (
    //idea behind taking "query" from options is to lift state up
    <div className="field">
      <FormControl
        variant="filled"
        disabled={props.disabled}
        sx={{ width: "100%" }}
      >
        <InputLabel id={`${props.name}-label`}>
          {props.label === undefined
            ? props.name[0].toUpperCase() +
              props.name.slice(1, props.name.length).toLowerCase()
            : props.label}
        </InputLabel>
        <Select
          labelId={`${props.name}-label`}
          className="field"
          value={props.query[props.name]}
          multiple
          onChange={(event) => {
            props.setQuery({ ...querycopy, [props.name]: event.target.value }); //basically just used for object composition - Object.assign returns the composed object
            // 				props.sendQuery({...querycopy, [props.name]:event.target.value});
          }}
        >
          {props.options.map((el) => (
            <MenuItem value={el} key={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
