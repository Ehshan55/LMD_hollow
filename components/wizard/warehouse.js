import { Button, Card, DisplayText, Form, FormLayout, Layout, Stack, TextField } from '@shopify/polaris';

import React, { useState, useContext } from 'react';

import LoaderContext from '../../contexts/LoaderContext';
import { DataContext } from '../../contexts/DataContext';

import AdminApiService from '../../apiservices/adminApiService';
const apiRequestService = new AdminApiService();

const Warehouse = (props) => {

    const { changeWarehouseData } = useContext(DataContext);

    const { showLoader } = useContext(LoaderContext);

    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');


    let DateObj = { address: {} };

    // On Create button click 
    const handleSubmit = () => {
        showLoader(true);
        if (locationName) {
            DateObj['title'] = locationName;
            DateObj.address['address_1'] = address;
            DateObj.address['address_2'] = apartment;
            DateObj.address['city'] = city;
            DateObj.address['country'] = country;
            DateObj.address['state'] = state
            DateObj.address['pincode'] = pincode;
            DateObj.address['phone'] = phone;

            apiRequestService.postCreateWarehouse(DateObj, (response) => {
                showLoader(false);
                if (response) {
                    changeWarehouseData(response?.data);
                    props.constructTost(response.msg.toUpperCase(), !response.status);
                    if (response.status) {
                        setTimeout(props.setPageCase(2), 2000);
                    }
                }
            });
        }
        else {
            props.constructTost('Please fill warehouse name', true);
            showLoader(false);
        }
    };
    return (
        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="extraLarge">Warehouse</DisplayText><br />
                            <DisplayText size="large">You can manage multiple delivery zone under this warehouse.</DisplayText>

                            <img className="helper_img" src="/images/wizard/2.png" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <DisplayText size="large">Create a warehouse</DisplayText><br />
                    <Form onSubmit={handleSubmit}>
                        <Card sectioned>
                            <FormLayout>
                                <TextField
                                    value={locationName}
                                    requiredIndicator
                                    label="Warehouse name"
                                    onChange={(value) => setLocationName(value)}
                                    autoComplete="off"
                                />
                                <p>
                                    Eg. Bangaluru warehouse
                                </p>
                            </FormLayout>

                        </Card>
                        <Card sectioned>
                            <FormLayout>
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
                            </FormLayout>
                        </Card><br />

                        <Stack alignment="center" distribution="trailing">
                            <Button primary submit>
                                Next
                            </Button>
                        </Stack>
                    </Form>
                </div>
            </div>

        </div>
    )
}

export default Warehouse