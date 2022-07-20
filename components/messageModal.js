import React, { Fragment, useState, useCallback, useEffect, useContext } from 'react';
import { Card, Icon, Heading, Modal } from '@shopify/polaris';
import {
    DeleteMinor, SmileyJoyMajor
} from '@shopify/polaris-icons';

function MessageModal({activeMessageModal, title, description, handleSucessChangeModal}) {

    return(
        <Modal
        small
        open={activeMessageModal}
        title={<b>{title?title:'Success'}</b>}
        onClose={handleSucessChangeModal}

    >
        <Card.Section>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                <Icon
                    source={SmileyJoyMajor}
                    color="success"
                    size="large"
                    
                />
               
                <br></br>

                <Heading>{description?description:'Password Change Successfull'}</Heading>
            </div>

        </Card.Section>
    </Modal>
    )
}

export default MessageModal;