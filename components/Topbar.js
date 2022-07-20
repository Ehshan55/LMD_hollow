import { TopBar } from '@shopify/polaris'
import React from 'react'

const Topbar = (props) => {
  return (
    <TopBar
      showNavigationToggle
      userMenu={props.userMenuMarkup}
      onNavigationToggle={props.toggleMobileNavigationActive}
    />
  )
}

export default Topbar
