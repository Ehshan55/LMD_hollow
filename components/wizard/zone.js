import { Button, Card, DisplayText, Form, FormLayout, Layout, Page, Stack, TextField, TextStyle } from '@shopify/polaris';

import React, { useContext, useState } from 'react';

import LoaderContext from '../../contexts/LoaderContext';
import { DataContext } from '../../contexts/DataContext';

import TextBoxTagInput from '../../components/textboxTagInput';

import AdminApiService from '../../apiservices/adminApiService';
const apiRequestService = new AdminApiService();

const Zone = (props) => {
    const { showLoader } = useContext(LoaderContext);
    const { warehouseData } = useContext(DataContext);

    const [locationName, setLocationName] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    let dateObj = { address: {} };

    const [pinCodeTags, setPinCodeTags] = useState([]);

    // * on Create button click
    const handleSubmit = () => {
        console.log(warehouseData._id);
        if (locationName) {
            showLoader(true);
            dateObj['title'] = locationName;
            dateObj.address['address_1'] = address;
            dateObj.address['address_2'] = apartment;
            dateObj.address['city'] = city;
            dateObj.address['country'] = country;
            dateObj.address['state'] = state
            dateObj.address['pincode'] = pincode;
            dateObj.address['phone'] = phone;

            if (pinCodeTags.length) {
                dateObj['pin_codes'] = pinCodeTags;
                if (warehouseData._id) {
                    apiRequestService.postCreateZone(warehouseData._id, dateObj, (response) => {
                        showLoader(false);
                        if (response) {
                            props.constructTost(response.msg.toUpperCase(), !response.status);
                            if (response.status) {
                                setTimeout(props.setPageCase(3), 2000);
                            }
                        }
                    });
                }
                else {
                    props.constructTost('Could not create zone. Please try again from dashboard.', true);
                    props.setPageCase(3);
                    console.log('Warehouse missing', true);
                    showLoader(false);
                }
            }
            else {
                props.constructTost('Please put atleast one pin-code', true);
                showLoader(false);
            }
        }
        else {
            props.constructTost('Please fill up zone name', true);
            showLoader(false);
        }

    };

    return (
        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="extraLarge">Warehouse's Zone</DisplayText><br />
                            <DisplayText size="large">Make sure you put the pin-codes correct.</DisplayText>
                            <DisplayText size="small"> All orders whose delivery address pin-code maching  </DisplayText>
                            <DisplayText size="small">  with the zone pin-code will be synced. </DisplayText>

                            <img className="helper_img" src="/images/wizard/3.png" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <DisplayText size="large">Create a zone</DisplayText><br />
                    <Form onSubmit={handleSubmit}>
                        <Card sectioned>
                            <FormLayout>
                                <TextField
                                    value={locationName}
                                    requiredIndicator
                                    label="Zone Name"
                                    onChange={(value) => setLocationName(value)}
                                    autoComplete="off"
                                />
                                <TextStyle variation="subdued">Eg. Bengaluru West</TextStyle >
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

                        </Card>


                        <TextBoxTagInput
                            cardTitle={'Pin Codes'}
                            textInputTitle={''}
                            textInputPlaceholder={'All order delivery pin-codes here...'}
                            textInputHelperText={'Just type the area pin-code followed by a comma(,) or space to add in the list'}
                            textDescriptionHelperText={'** Orders will segregate using these pin-codes.'}
                            defaultValue={pinCodeTags}
                            pinCodeChange={(val) => { setPinCodeTags(val) }} /><br />


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

export default Zone