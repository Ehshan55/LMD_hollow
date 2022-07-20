import { Card, List, Page, TextStyle } from '@shopify/polaris'
import React, { useContext, useEffect, useState } from 'react'
import SideNavBar from '../../../components/sideNavBar'

import LoaderContext from '../../../contexts/LoaderContext';
import AdminApiService from '../../../apiservices/adminApiService';
import { uppercase } from '../../../utils/textFormate';
const adminApiRequestService = new AdminApiService();

const GeoLocation = () => {
    const [scriptStatus, setScriptStatus] = useState('disabled');
    const { showLoader } = useContext(LoaderContext);

    const toggleGeoLocation = () => {
        showLoader(true);
        let scrpt_status_change = '';
        if (scriptStatus == 'disabled') {
            setScriptStatus('enabled');
            scrpt_status_change = 'enable';
        }
        else {
            setScriptStatus('disabled');
            scrpt_status_change = 'disable';
        }
        adminApiRequestService.postToggleThemeScript(scrpt_status_change, (response) => {
            // console.log(response);
            showLoader(false);
        })
    }

    useEffect(() => {
        showLoader(true);
        adminApiRequestService.getCheckThemeScriptStatus((response) => {
            if (response) {
                if (response.script_status) {
                    setScriptStatus('enabled');
                }
                else {
                    setScriptStatus('disabled');
                }
            }
            showLoader(false);
        })
    }, [])

    return (
        <SideNavBar>
            <Page title="Geo Location Configuration"
                subtitle="Enable/disable map location in store's thank you page">

                <br />
                <Card
                    title={'Geo location is ' + uppercase(scriptStatus)}
                    actions={{ content: scriptStatus == 'enabled' ? 'Disable' : 'Enable', destructive: scriptStatus == 'enabled' ? true : false, onAction: toggleGeoLocation }}
                    sectioned>
                    <Card.Section title="Explaination">
                        <List>
                            <List.Item>Enabling Geo Location will let the user to pin point their exact location of delivery using a map in the thank you page after placing orders</List.Item>
                            <List.Item>The map with dragable pin will only be visible for the orders whose delivery pin code matches with any of the warehouse zone pin codes</List.Item>
                        </List>
                    </Card.Section>

                    <p>Check below screen for more details:</p>
                    <br></br>
                    <img
                        alt=""
                        width="100%"
                        height="100%"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        src="/images/script_enabling_img.png"
                    />

                </Card>
            </Page>
        </SideNavBar>
    )
}

export default GeoLocation