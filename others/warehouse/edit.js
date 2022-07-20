import { Banner, Button, Card, Form, FormLayout, Layout, Page, Stack, TextField } from '@shopify/polaris';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter, withRouter } from 'next/router';

import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';

import { pageTitle } from '../../../utils/hardCoded';

import SideNavBar from '../../../components/sideNavBar';

import AdminApiService from '../../../apiservices/adminApiService';
import { validateLogin } from '../../../contexts/AuthContext';
const apiRequestService = new AdminApiService();

const EditWarehouse = () => {

    const { showLoader } = useContext(LoaderContext);
    const router = useRouter();
    const { constructTostStates, changeWarehouseData, warehouseData } = useContext(DataContext);

    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    let formDateObj = { address: {} };

    //* Getting Warehouse/ Zone Conditionally
    useEffect(() => {

        showLoader(true);
        if (router.query.id) {
            apiRequestService.getWarehouseDetailsById(router.query.id, (response) => {
                if (response) {
                    setLocationName(response?.title);
                    setAddress(response.address?.address_1);
                    setApartment(response.address?.address_2);
                    setCity(response?.address.city)
                    setCountry(response.address?.country);
                    setState(response.address?.state);
                    setPincode(response.address?.pincode);
                    setPhone(response.address?.phone);
                }
                showLoader(false);
            });
        }
    }, []);

    //* On Update button click 
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

            // * id is warehouse_id
            let warehouse_id = router.query.id;
            if (warehouse_id) {
                // console.log('Do update warehouse api', warehouse);
                apiRequestService.putUpdateWarehouse(warehouse_id, formDateObj, (response) => {
                    showLoader(false);
                    if (response) {
                        constructTostStates(response.msg.toUpperCase(), !response.status);
                        if (response.status) {
                            let updatedWarehouse = {
                                id: warehouseData.id,
                                location: city,
                                name: locationName,
                                state: state,
                            }
                            changeWarehouseData(updatedWarehouse);
                        }
                    }
                },
                );
            }
        }
        else {
            constructTostStates('Please fill up warehouse name');
            showLoader(false);
        }
    };


    return (
        <SideNavBar>
            <Page
                title={pageTitle.warehouse.edit}
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
                                    <FormLayout>
                                        <TextField
                                            value={locationName}
                                            requiredIndicator
                                            label="Warehouse Name"
                                            onChange={(value) => setLocationName(value)}
                                            autoComplete="off"
                                            helpText="Eg. Bangaluru Warehouse"
                                        />
                                    </FormLayout>
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

EditWarehouse.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default withRouter(EditWarehouse);
