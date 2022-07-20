import { Toast } from '@shopify/polaris'
import React from 'react'

const ToastUp = (props) => {
  return (
    <Toast onDismiss={props.toggleToastActive} error={props.toastErrorMessage} content={props.text} duration={props.toastActiveDuration} />
  )
}

export default ToastUp
