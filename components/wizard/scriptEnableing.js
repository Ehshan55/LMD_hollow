import { Button, Card, DisplayText, Layout, List, Stack } from '@shopify/polaris'
import React, { useContext, useEffect, useState } from 'react'

import LoaderContext from '../../contexts/LoaderContext';
import AdminApiService from '../../apiservices/adminApiService';
import { uppercase } from '../../utils/textFormate';
const adminApiRequestService = new AdminApiService();

const ScriptEnableing = (props) => {
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

    const handleNext = () => {
        if (scriptStatus == 'disabled') {
            props.constructTost('Please enable geo-location');
        }
        if (scriptStatus == 'enabled') {
            props.setPageCase(5);
        }
    }
    return (

        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="extraLarge">Map Integration </DisplayText><br />
                            <DisplayText size="large">Let the customers share their exact place of delivery.</DisplayText>

                            <img className="helper_img" src="/images/wizard/5.png" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <Card
                        title={'Geo location is ' + uppercase(scriptStatus)}
                        actions={{ content: scriptStatus == 'enabled' ? 'Disable' : 'Enable', destructive: scriptStatus == 'enabled' ? true : false, onAction: toggleGeoLocation }}
                        sectioned>
                        <Card.Section title="Explaination">
                            <List>
                                <List.Item>Enabling Geo Location will let the user to pin point there exact location of delivery using a map in the thank you page after placing orders</List.Item>
                                <List.Item>The map with dragable pin will only be visible for the orders whose delivery pin code matches with any of the warehouse zone pin codes</List.Item>
                            </List>
                        </Card.Section>

                        <p>Check below example for more details:</p>
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

                    </Card><br />
                    <Stack alignment="center" distribution="trailing">
                        <Button primary onClick={handleNext}>
                            Next
                        </Button>
                    </Stack>
                </div>
            </div>

        </div>
    )
}

export default ScriptEnableing