import React, { CSSProperties } from "react";
import Male from "./GenericMale.png";
import Female from "./GenericFemale.png";

/**
 * Props for the UserImage component
 */
interface ImageProps {
	/** Custom styles to apply */
	style?: CSSProperties;
	/** Student username (for home.iitk.ac.in profile picture) */
	u: string;
	/** Student roll number (for OA profile picture) */
	i: string;
	/** Student gender (M/F) for fallback image */
	g: string;
	/** Alt text for accessibility */
	alt: string;
}

/**
 * UserImage Component
 * 
 * Displays student profile picture with cascading fallbacks:
 * 1. Student's homepage profile picture (home.iitk.ac.in)
 * 2. Official OA profile picture (oa.cc.iitk.ac.in)
 * 3. Generic male/female placeholder based on gender
 * 
 * @component
 */
const UserImage: React.FC<ImageProps> = ({ style = {}, u, i, g, alt }) => {
	const fallbackImage = g === "F" ? Female.src : Male.src;

	return (
		<div
			style={{
				width: "150px",
				height: "150px",
				position: "relative",
				borderRadius: "100%",
				flexShrink: 0,
				backgroundImage: `url("https://home.iitk.ac.in/~${u}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${i}_0.jpg"), url("${fallbackImage}")`,
				backgroundPosition: "center top",
				backgroundSize: "cover",
				...style,
			}}
			role="img"
			aria-label={alt}
		/>
	);
};

export default React.memo(UserImage);