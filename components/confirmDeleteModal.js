
import React from 'react'
import { Modal, Subheading } from "@shopify/polaris";


const ConfirmationModalPopup = (props) => {

    return (
        <Modal
            small
            open={props.modalActive}
            onClose={props.cloesModalActive}
            title={props.title}
            primaryAction={{
                content: props.btntxt,
                onAction: props.action,
                destructive: props.destructive,
                loading: props.loading
            }}
        >
            <Modal.Section>
                <Subheading>{props.subtitle}</Subheading>
            </Modal.Section>
        </Modal>
    )
}

export default ConfirmationModalPopup