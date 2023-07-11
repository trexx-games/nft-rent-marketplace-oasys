import { ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import Head from 'next/head';
import { OASYS_CONNECTION } from '../config/blockchain';
import { useState, useEffect } from 'react';
import { sdkKey } from '../config/walletSdk';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    (function (w, d, s, o, f, js, fjs, e) {
      w[o] =
        w[o] ||
        function () {
          (w[o].q = w[o].q || []).push(arguments);
        };
      (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
      js.id = o;
      js.src = f;
      js.async = 1;
      fjs.parentNode.insertBefore(js, fjs);
      w.SingularityEnv = e;
    })(
      window,
      document,
      'script',
      'Singularity',
      'https://unpkg.com/singularity-client-script@1.7.0/index.js',
      '',
      '',
      'production',
    );

    console.log('adding event listener', new Date().getSeconds());
    window.document.body.addEventListener('Singularity-mounted', () => {
      console.log('------sdk is mounted------');
      let key;
      if (localStorage.getItem('singularity-key')) {
        console.log('using key through localStorage');
        key = localStorage.getItem('singularity-key');
      } else {
        console.log('using default key value');
        key = sdkKey;
      }
      localStorage.setItem('singularity-key', key);
      console.log(
        `tichnas singularity mounted with key=${key}`,
        new Date().getSeconds(),
      );

      window.Singularity.init(key);

      window.SingularityEvent.subscribe('SingularityEvent-logout', () => {
        navigate('/');
        window.SingularityEvent.close();
      });
      window.SingularityEvent.subscribe('SingularityEvent-login', (data) => {
        console.log('login data --->', data);
        navigate('/');
        window.SingularityEvent.close();
      });

      window.SingularityEvent.subscribe('SingularityEvent-open', () =>
        setDrawerOpen(true),
      );

      window.SingularityEvent.subscribe('SingularityEvent-close', () => {
        console.log('subscribe close drawer ');
        setDrawerOpen(false);
      });

      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionApproval',
        (data) => {
          console.log('Txn approved', JSON.parse(data));
        },
      );
      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionSuccess',
        (data) => {
          console.log('Txn Successfull', JSON.parse(data));
        },
      );
      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionFailure',
        (data) => {
          console.log('Txn failed', JSON.parse(data));
        },
      );

      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <ThirdwebProvider activeChain={OASYS_CONNECTION}>
      <ChakraProvider>
        {drawerOpen && (
          <div
            onClick={() => window.SingularityEvent.close()}
            style={{
              height: '100vh',
              width: '100vw',
              backgroundColor: 'black',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1,
              opacity: 0.5,
            }}
          />
        )}
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
