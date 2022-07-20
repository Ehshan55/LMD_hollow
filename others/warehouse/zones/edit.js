import { Banner, Button, Card, Form, FormLayout, Layout, Page, Stack, TextField } from '@shopify/polaris';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter, withRouter } from 'next/router';

import LoaderContext from '../../../../contexts/LoaderContext';
import { validateLogin } from '../../../../contexts/AuthContext';
import { DataContext } from '../../../../contexts/DataContext';

import SideNavBar from '../../../../components/sideNavBar';
import TextBoxTagInput from '../../../../components/textboxTagInput';

import { pageTitle } from '../../../../utils/hardCoded';

import AdminApiService from '../../../../apiservices/adminApiService';
const apiRequestService = new AdminApiService();

const EditZone = () => {

    const router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    let formDateObj = { address: {} };

    const [pinCodeTags, setPinCodeTags] = useState([]);


    //* Getting Warehouse/ Zone Conditionally
    useEffect(() => {

        // console.log("Warehouse id for New Zone creation", router.query.id);

        showLoader(true);
        //* id is zone_id
        if (router.query.id) {
            apiRequestService.getZoneDetailsById(router.query.id, (response) => {
                if (response) {
                    setLocationName(response?.title);
                    setAddress(response.address?.address_1);
                    setApartment(response.address?.address_2);
                    setCity(response.address?.city)
                    setCountry(response.address?.country);
                    setState(response.address?.state);
                    setPincode(response.address?.pincode);
                    setPhone(response.address?.phone);
                    setPinCodeTags(response.pin_codes);

                }
                showLoader(false);
            });
        }
    }, []);

    //* On Update button click this is mutual for warehouse and zone under condition
    const handleSubmit = () => {

        if (locationName) {
            showLoader(true);
            formDateObj['title'] = locationName;
            formDateObj.address['address_1'] = address;
            formDateObj.address['address_2'] = apartment;
            formDateObj.address['city'] = city;
            formDateObj.address['country'] = country;
            formDateObj.address['state'] = state
            formDateObj.address['pincode'] = pincode;
            formDateObj.address['phone'] = phone;

            if (pinCodeTags.length) {
                // console.log('Do create zone api', props.warehouseId);
                formDateObj['pin_codes'] = pinCodeTags;
                //* id is zone_id
                if (router.query.id) {
                    apiRequestService.putUpdateZone(router.query.id, formDateObj, (response) => {
                        showLoader(false);
                        if (response) { constructTostStates(response.msg.toUpperCase(), !response.status); }
                    });
                }
            }
            else {
                constructTostStates('Please put atleast one pin code', true);
                showLoader(false);
            }
        }
        else {
            constructTostStates('Please fill up zone name', true);
            showLoader(false);
        }

    };


    return (
        <SideNavBar>
            <Page
                title={pageTitle.zone.edit}
                breadcrumbs={[{ content: 'Products', onAction: () => router.back() }]}
            >
                <Layout>
                    <Layout.Section>
                        <Banner title='Each warehouse can have their own set of zones' status="info">
                            <p>Make sure you put the pincodes correct</p>
                        </Banner>
                    </Layout.Section>

                    <Layout.AnnotatedSection
                        title="Details"
                        description="Give this location a short name to make it easy to identify. You’ll see this name in areas like order table"
                    >
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <Card sectioned>
                                    <TextField
                                        value={locationName}
                                        requiredIndicator
                                        label="Zone Name"
                                        onChange={(value) => setLocationName(value)}
                                        autoComplete="off"
                                        helpText="Eg. North Zone"
                                    />
                                </Card>

                                <Card sectioned>
                                    <TextField
                                        value={address}
                                        label="Address"
                                        onChange={(value) => setAddress(value)}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        value={apartment}
                                        label="Apartment, suite, etc."
                                        onChange={(value) => setApartment(value)}
                                        autoComplete="off"
                                    />
                                    <TextField value={city} type="Text" label="City" onChange={(value) => setCity(value)} autoComplete="off" />

                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            <TextField
                                                value={country}
                                                label="Country/Region"
                                                onChange={(value) => setCountry(value)}
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={state}
                                                label="State"
                                                onChange={(value) => setState(value)}
                                                autoComplete="off"
                                            />
                                            <TextField
                                                value={pincode}
                                                label="Pincode"
                                                onChange={(value) => setPincode(value)}
                                                autoComplete="off"
                                            />
                                        </FormLayout.Group>
                                    </FormLayout>
                                    <TextField
                                        value={phone}
                                        label="Phone"
                                        onChange={(value) => setPhone(value)}
                                        autoComplete="off"
                                    />
                                </Card>

                                <TextBoxTagInput
                                    cardTitle={'Pin Codes'}
                                    textInputTitle={''}
                                    textInputPlaceholder={'All Order Delivery Pin Codes here...'}
                                    textInputHelperText={'Just type the Area Pin Code followed by a comma(,) or space to add in the list'}
                                    textDescriptionHelperText={' Orders will segregate using these Pin Codes. Do not put duplicate pin code related to other Zones. Duplicate pin code will create issues in assignment.'}
                                    defaultValue={pinCodeTags}
                                    pinCodeChange={(val) => { setPinCodeTags(val) }} />


                                <Stack alignment="center" distribution="equalSpacing">
                                    <Button plain onClick={() => router.back()} >
                                        {/* {warehouseId || zoneId ? 'Delete' : 'Cancel'} */}
                                        Back
                                    </Button>
                                    <Button primary submit>
                                        Update
                                    </Button>
                                </Stack>
                            </FormLayout>
                        </Form>
                    </Layout.AnnotatedSection>

                </Layout>
            </Page>
        </SideNavBar>
    );
};

EditZone.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default withRouter(EditZone);
