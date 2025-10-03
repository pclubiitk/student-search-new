import Avatar from "@mui/material/Avatar";

import Male from "@/components/assets/GenericMale.png";
import Female from "@/components/assets/GenericFemale.png";

interface ImageProps {
	style: Object;
	u: string;
	i: string;
	g: string;
	alt:string;
}

// console.log(Male);
// console.log(Female);

export default function Image(props: ImageProps) {
	return (
		<div style={{
			width:"150px",
			height:"150px",
			position:"relative",
			borderRadius:"100%",
			flexShrink:"0",
	backgroundImage:`url("https://home.iitk.ac.in/~${props.u}/dp"),url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${props.i}_0.jpg"),url("${props.g === "F" ? Female.src : Male.src}")`,
			backgroundPosition:"center top",
			backgroundSize:"cover",
			...props.style
	
		}} />
	)
}