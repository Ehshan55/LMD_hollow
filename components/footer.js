import { FooterHelp, Link } from '@shopify/polaris'
import React, { Fragment, useEffect, useState } from 'react'

const Footer = () => {
  const [isprivacyPage, setIsprivacyPage] = useState(false);
  useEffect(() => {
    if (window.location.href.includes('privacy_policy')) {
      setIsprivacyPage(true);
    }
    else {
      setIsprivacyPage(false);
    }
  }, [])
  return (<Fragment>
    {!isprivacyPage && <FooterHelp>
      Developed by{' '}
      <Link external url="https://digirex.io/">
        Digirex Technologies
      </Link>
    </FooterHelp>}
  </Fragment>)
}

export default Footer
