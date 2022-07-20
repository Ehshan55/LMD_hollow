import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Scrollengine provides Shopify, Wix, Magento and WooCommerce Custom App and Storefront Development. 
            Scrollengine helps e-commerce platfroms to develop custom soultion and help them grow in Shopify, Magento, Wix, WooCommerce."/>
          <meta name="author" content="Scrollengine(https://scrollengine.com) | Digirex.io (https://digirex.io)" />
          <meta property="og:site_name" content="Scrollengine: Local Delivery" />
          <meta property="og:site" content="localdelivery.scrollengine.com" />
          <meta property="og:title" content="Local Delivery | Scrollengine | Digirex Technologies" />
          <meta property="og:description" content="Local Delivery helps to manage last mile delivery for e-commerce stores hosted on shopify, magento, wordpress, wix and others" />
          <meta property="og:image" content="/public/images/logo.png" />
          <meta property="og:url" content="scrollengine.com" />
          <meta property="og:type" content="website" />

          <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
          {/* <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@9.19.0/build/esm/styles.css" /> */}

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          {/* slack logger */}
          {/* <script src="/js/slackLogger.js"></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  // const originalRenderPage = ctx.renderPage;

  // ctx.renderPage = () => {
  //   originalRenderPage({
  //     enhanceApp: (App) => (props) => <App {...props} />,
  //   });
  // }


  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
  };
};


export default MyDocument;