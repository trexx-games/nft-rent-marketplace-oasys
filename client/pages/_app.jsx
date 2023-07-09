import { ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import Head from 'next/head';
import { OASYS_CONNECTION } from '../config/blockchain';

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={OASYS_CONNECTION}>
      <ChakraProvider>
        <Head>
          <title>NFT Rent</title>
          <meta property="og:title" content="NFT Rent" key="title" />
          <link rel="icon" href="/icons/favicon.ico" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
