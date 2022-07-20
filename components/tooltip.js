import { TextStyle } from '@shopify/polaris'
import React from 'react'

const Tooltip = (props) => {
  return (
    <div style={{ padding: '75px 0' }}>
      <Tooltip active content={props.text}>
        {props.element}
      </Tooltip>
    </div>
  )
}

export default Tooltip
