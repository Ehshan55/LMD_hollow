import { Banner, Button, Card, Form, FormLayout, Layout, Page, Stack, TextField } from '@shopify/polaris';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';

import LoaderContext from '../../contexts/LoaderContext';
import { DataContext } from '../../contexts/DataContext';
import { validateLogin } from '../../contexts/AuthContext';

import { pageTitle } from '../../utils/hardCoded';

import SideNavBar from '../../components/sideNavBar';

import AdminApiService from '../../apiservices/adminApiService';
const apiRequestService = new AdminApiService();

const AddWarehouse = () => {

    const { constructTostStates } = useContext(DataContext);
    const { showLoader } = useContext(LoaderContext);
    const router = useRouter();

    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');


    let formDateObj = { address: {} };

    // On Create button click 
    const handleSubmit = () => {
        showLoader(true);
        if (locationName) {
            formDateObj['title'] = locationName;
            formDateObj.address['address_1'] = address;
            formDateObj.address['address_2'] = apartment;
            formDateObj.address['city'] = city;
            formDateObj.address['country'] = country;
            formDateObj.address['state'] = state
            formDateObj.address['pincode'] = pincode;
            formDateObj.address['phone'] = phone;

            apiRequestService.postCreateWarehouse(formDateObj, (response) => {
                showLoader(false);
                if (response) {
                    constructTostStates(response.msg.toUpperCase(), !response.status);
                    if (response.status) {
                        setTimeout(router.back(), 2000);
                    }
                }
            });
        }
        else {
            constructTostStates('Please fill up warehouse name', true);
            showLoader(false);
        }
    };


    return (
        <SideNavBar>
            <Page
                title={pageTitle.warehouse.add}
                breadcrumbs={[{ content: 'Products', onAction: () => router.back() }]}
            >
                <Layout>
                    <Layout.Section>
                        <Banner title="You can manage multiple delivery zone under this warehouse." status="info">
                            <p>After creating the warehouse create zones.</p>
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
                                        label="Warehouse Name"
                                        onChange={(value) => setLocationName(value)}
                                        autoComplete="off"
                                        helpText="Eg. Bangaluru Warehouse"
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

                                <Stack alignment="center" distribution="equalSpacing">
                                    <Button plain onClick={() => router.back()} >
                                        {/* {warehouseId || zoneId ? 'Delete' : 'Cancel'} */}
                                        Back
                                    </Button>
                                    <Button primary submit>
                                        Create
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

AddWarehouse.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default AddWarehouse;
