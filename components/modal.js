
import React from 'react'
import { Modal, Subheading } from "@shopify/polaris";
import { useAuthentication } from '../contexts/AuthContext';

const ModalPopup = (props) => {
  const { logout } = useAuthentication();
  return (
    <Modal
      open={props.modalActive}
      onClose={props.toggleModalActive}
      title="Confirmation"
      primaryAction={{
        content: 'Logout',
        onAction: logout,
        // url: '/LoginPage',
      }}
    >
      <Modal.Section>
        <Subheading>Are you sure want to logout?</Subheading>
      </Modal.Section>
    </Modal>
  )
}

export default ModalPopup
