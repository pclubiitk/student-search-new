import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function GuestFooter() {
    return (
        <Paper sx={{marginTop: 'calc(10% + 60px)',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        }} component="footer" square variant="outlined">
        <Container maxWidth="lg">
          {/* <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              my:1
            }}
          >
              
          </Box> */}
  
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
            <Typography variant="caption" sx={{fontSize: '0.80rem'}}>
                Family tree provided by <a href="https://www.iitk.ac.in/counsel/">Institute Counselling Service IITK</a>
            </Typography>
            <div>
                <img src="/cslogo.png" width={18} height={18} style={{marginLeft: '8px'}} alt="Logo" />
            </div>
          </Box>
        </Container>
      </Paper>
    );
  }