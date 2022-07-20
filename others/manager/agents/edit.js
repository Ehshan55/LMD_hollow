import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Banner, Button, Card, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle, Checkbox, List } from '@shopify/polaris';

import ManagerApiService from '../../../apiservices/managerApiService';
import validateEmail from '../../../utils/validateEmail';
import { validateLogin } from '../../../contexts/AuthContext';
import { Router, useRouter } from 'next/router';
import { pageTitle } from '../../../utils/hardCoded';
import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';
import SideNavBarManager from '../../../components/sideNavBarManager';
const apiRequest = new ManagerApiService();

const EditManageAgent = () => {
    const Router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [agentName, setAgentName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    let DateObj = { user_type: 'manager', address: {} };

    const [avaliableZones, setAvaliableZones] = useState([]);

    const [assignedZonesIdsArr, setAssignedZonesIdsArr] = useState([]);
    const makeAssignedZonesIdsArr = (zone_access) => {
        let zone_access_ids = [];
        zone_access.forEach((zone) => {
            zone_access_ids.push(zone._id);
        });
        setAssignedZonesIdsArr(zone_access_ids);
    };
    useEffect(() => {
        showLoader(true);
        if (Router.query.id) {
            // console.log('Get Managr');
            apiRequest.getDeliveryAgentDetailsById(Router.query.id, (response) => {
                // console.log(response);
                if (response) {
                    let Agent = response;
                    setAgentName(Agent?.name);
                    setAddress(Agent.address?.address_1);
                    setApartment(Agent.address?.address_2);
                    setEmail(Agent?.email);
                    setCountry(Agent.address?.country);
                    setState(Agent.address?.state);
                    setPincode(Agent.address?.pincode);
                    setPhone(Agent.address?.phone);
                    makeAssignedZonesIdsArr(Agent.delivery_zone_access);

                    showLoader(false);
                }
            });
        }
        apiRequest.getAllDeliveryZones((response) => {
            if (response) {
                // console.log('All avaliable Zones ', response);
                setAvaliableZones(response);
            }
            showLoader(false);
        });

    }, []);

    const handelSubmit = () => {
        showLoader(true);

        if (!agentName || !email || !address || !apartment || !country || !state || !pincode || !phone) {
            constructTostStates('Please fill all fields');
            showLoader(false);
        }
        else if (!validateEmail(email, constructTostStates)) {
            showLoader(false);
        }

        else if (assignedZonesIdsArr.length == 0) {
            constructTostStates('Please Select a zone');
            showLoader(false);
        } else {

            DateObj.name = agentName;
            DateObj.email = email;
            DateObj.address.address_1 = address;
            DateObj.address.address_2 = apartment;
            DateObj.address.country = country;
            DateObj.address.state = state;
            DateObj.address.pincode = pincode;
            DateObj.address.phone = phone;

            DateObj.delivery_zone_access = assignedZonesIdsArr;

            // console.log('props.agentId', props.agentId);
            // console.log('Do Edit with', DateObj);
            apiRequest.putUpdateDelveryAgent(Router.query.id, DateObj, (response) => {
                if (response) {
                    // console.log(response);
                    constructTostStates(response.msg.toUpperCase(), !response.status);

                }
                showLoader(false);
            },
            );

        }
    };

    // to handel checkbox functionality
    const handelCheckBox = useCallback(
        (zoneId) => {
            // console.log(assignedZonesIdsArr, zoneId);
            if (assignedZonesIdsArr.includes(zoneId)) {
                // console.log('remove ', zoneId);
                setAssignedZonesIdsArr(
                    assignedZonesIdsArr.filter((id) => id !== zoneId),
                );
            } else {
                // console.log('add ', zoneId);
                setAssignedZonesIdsArr([...assignedZonesIdsArr, zoneId]);
            }
        },
        [assignedZonesIdsArr],
    );


    return (
        <SideNavBarManager>
            <Page
                title={pageTitle.executive.edit}
                breadcrumbs={[{ content: 'Agents', onAction: () => Router.back() }]}
            >
                <Layout>
                    <Layout.Section>
                        <Banner title="Delivery executive updating notes" status="info">
                            <List type="bullet">
                                <List.Item>All fields are mandatory</List.Item>
                                <List.Item>A delivery agent can be assigned with multipal delivery zones</List.Item>
                            </List>
                        </Banner>
                    </Layout.Section>

                    <Layout.AnnotatedSection
                        title="Delivery Executive Details"
                        description="Put Delivery Executive Name and Email for access.
          Same email will be used for logging into dashbaord. Make sure you are putting the right email."
                    >
                        <Form>
                            <FormLayout>
                                <Card sectioned>
                                    <TextField
                                        requiredIndicator
                                        value={agentName}
                                        label="Name"
                                        onChange={(value) => setAgentName(value)}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        requiredIndicator
                                        value={email}
                                        type="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                                        label="Account email"
                                        onChange={(value) => setEmail(value)}
                                        autoComplete="email"
                                        onBlur={() => validateEmail(email, constructTostStates)}
                                    />
                                    <br />
                                    <TextStyle variation="positive">  Please save this info. User can login using the same information.</TextStyle>


                                </Card>

                                <Card sectioned>
                                    <TextField
                                        requiredIndicator
                                        value={address}
                                        label="Address"
                                        onChange={(value) => setAddress(value)}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        requiredIndicator
                                        value={apartment}
                                        label="Apartment, suite, etc."
                                        onChange={(value) => setApartment(value)}
                                        autoComplete="off"
                                    />


                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            <TextField
                                                requiredIndicator
                                                value={country}
                                                label="Country/Region"
                                                onChange={(value) => setCountry(value)}
                                                autoComplete="off"
                                            />
                                            <TextField
                                                requiredIndicator
                                                value={state}
                                                label="State"
                                                onChange={(value) => setState(value)}
                                                autoComplete="off"
                                            />
                                            <TextField
                                                requiredIndicator
                                                value={pincode}
                                                label="Pincode"
                                                onChange={(value) => setPincode(value)}
                                                autoComplete="off"
                                            />
                                        </FormLayout.Group>
                                    </FormLayout>
                                    <TextField
                                        requiredIndicator
                                        value={phone}
                                        label="Phone"
                                        onChange={(value) => setPhone(value)}
                                        autoComplete="off"
                                    />
                                </Card>

                            </FormLayout>
                        </Form>
                    </Layout.AnnotatedSection>

                    <Layout.AnnotatedSection
                        title="Zone Access"
                        description="Check mark zones to assign this delivery agent"
                    >
                        <Card sectioned>
                            <ResourceList

                                resourceName={{ singular: 'zone', plural: 'zones' }}
                                items={avaliableZones?.map((zone, index) => {
                                    return {
                                        id: zone._id,
                                        name: zone.title,

                                        zone_address: zone.address?.address_1,

                                        checkbox: (
                                            <Checkbox
                                                checked={
                                                    assignedZonesIdsArr.includes(zone._id)

                                                }
                                                onChange={() => handelCheckBox(zone._id)}
                                            />
                                        ),
                                    };
                                })}
                                renderItem={(item) => {
                                    const { id, name, zone_address, checkbox } = item;


                                    return (
                                        <ResourceItem
                                            id={id}

                                            accessibilityLabel={`View details for ${id}`}

                                        >
                                            <Stack>
                                                {checkbox}
                                                <h3>
                                                    <TextStyle variation="strong">{name}</TextStyle>
                                                </h3>

                                                <div>{zone_address}</div>
                                            </Stack>
                                        </ResourceItem>
                                    );
                                }}
                            />
                        </Card>
                        <br />
                        <Stack alignment="center" distribution="equalSpacing">
                            <Button plain destructive onClick={() => Router.back()}>
                                Back
                            </Button>
                            <Button primary onClick={handelSubmit}>
                                Update
                            </Button>
                        </Stack>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </SideNavBarManager>
    );
};

EditManageAgent.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default EditManageAgent;
