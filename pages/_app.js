import '../public/css/app.css';
import '../public/css/timeline.css';
import '../public/css/index.css';
import '../public/css/wizard_style.css';
import "../public/css/legend.css";

import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { AppProvider, Modal, Spinner } from '@shopify/polaris';

import Footer from '../components/footer';

import { AuthProvider } from '../contexts/AuthContext';
import LoaderContext from '../contexts/LoaderContext';
import { DataProvider } from '../contexts/DataContext';

import dynamic from 'next/dynamic'

import * as ga from '../lib/analytics'

const CrispWithNoSSR = dynamic(
  () => import('../components/crisp'),
  { ssr: false }
)

function WrappedApp({ Component, pageProps, ...appProps }) {

  const theme = {
    logo: {
      width: 124,
      topBarSource: '/images/logo.png',
      contextualSaveBarSource: '/images/logo.png',
      // url: 'https://digirex.in/',
      accessibilityLabel: 'Digirex',
    },
  };

  //Start of Backdrop Config
  const [showBackdrop, setShowBackdrop] = useState(false);
  //End of Backdrop Config

  const handleModalClose = useCallback(() => setShowBackdrop(false), []);

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    }
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events]);


  if ([`/`].includes(appProps.router.pathname)) {
    // console.log("Home page");
    return (<><Component {...pageProps} /><CrispWithNoSSR /></>);
  } else {
    // console.log("Other pahes")
    return (
      <AppProvider
        i18n
      >
        <LoaderContext.Provider value={{ showLoader: setShowBackdrop, }} >
          <AuthProvider>
            <DataProvider>
              <Component {...pageProps} />
            </DataProvider>
          </AuthProvider>
        </LoaderContext.Provider>
        <Modal open={showBackdrop} loading={true} noScroll={true} small={true} onClose={handleModalClose} >
        </Modal>
        <CrispWithNoSSR />
        <Footer />
      </AppProvider>
    );
  }






}

export default WrappedApp;
