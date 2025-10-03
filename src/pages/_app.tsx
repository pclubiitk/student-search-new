import { StyledEngineProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app'
import "@/styles/styles.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
  	<>
    <Head>
      	<title>Student Search | IITK</title>
      	<link rel="icon" type="image/png" sizes="32x32" href="/icons/32x32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/icons/16x16.png" />
		<link rel="manifest" href="/manifest.json" />
	</Head>
  <StyledEngineProvider injectFirst>
  	<Component {...pageProps} />
  </StyledEngineProvider></>)
}
