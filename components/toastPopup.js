import React from 'react';
import { Toast } from '@shopify/polaris';

function ToastPopup(props) {

    const toggleActive = () => {
        if (props.cb) {
            props.cb();
        }
    }

    return (
        <div>
            {props.activeStat ? (
                <Toast content={props.message} onDismiss={() => { toggleActive() }} />
            ) : (
                <></>
            )}
        </div>
    );
}


export default ToastPopup;