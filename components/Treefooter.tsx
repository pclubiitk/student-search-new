import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

/**
 * GuestFooter Component
 * 
 * Displays footer information about the family tree data source.
 * Fixed at the bottom of the page.
 * 
 * @component
 */
export default function GuestFooter() {
	return (
		<Paper
			sx={{
				marginTop: 'calc(10% + 60px)',
				position: 'fixed',
				bottom: 0,
				width: '100%',
			}}
			component="footer"
			square
			variant="outlined"
		>
			<Container maxWidth="lg">
				<Box
					sx={{
						flexGrow: 1,
						justifyContent: "center",
						display: "flex",
						alignItems: "center",
						mb: 0.5,
						mt: 0.5
					}}
				>
					<Typography variant="caption" sx={{ fontSize: '0.80rem' }}>
						Family tree provided by{' '}
						<a href="https://www.iitk.ac.in/counsel/">
							Institute Counselling Service IITK
						</a>
					</Typography>
					<div style={{ marginLeft: '8px' }}>
						<Image
							src="/cslogo.png"
							width={18}
							height={18}
							alt="Counselling Service Logo"
						/>
					</div>
				</Box>
			</Container>
		</Paper>
	);
}