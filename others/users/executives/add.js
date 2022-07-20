import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Banner, Button, Card, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle, Checkbox, List, Collapsible, TextContainer, Badge, Thumbnail, Tooltip } from '@shopify/polaris';
import { useRouter } from 'next/router';

import validateEmail from '../../../../utils/validateEmail';
import { pageTitle } from '../../../../utils/hardCoded';

import SideNavBar from '../../../../components/sideNavBar';

import LoaderContext from '../../../../contexts/LoaderContext';
import { DataContext } from '../../../../contexts/DataContext';
import { validateLogin } from '../../../../contexts/AuthContext';

import AdminApiService from '../../../../apiservices/adminApiService';
const adminApiRequestService = new AdminApiService();

const AddAgent = () => {
    const router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [agentName, setAgentName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    const [avaliableZones, setAvaliableZones] = useState([]);
    const [assignedZonesIdsArr, setAssignedZonesIdsArr] = useState([]);

    const [search, setSearch] = useState();

    const [filtered, setFiltered] = useState([]);

    let dateObj = { user_type: 'vendor', address: {} };


    // * on create button click
    const handelSubmit = () => {
        showLoader(true);
        if (!agentName || !email || !phone) {
            constructTostStates('Please fill mandatory fields');
            showLoader(false);
        }
        else if (!validateEmail(email, constructTostStates)) {
            showLoader(false);
        }
        else if (password == '') {
            constructTostStates('Please fill password fields');
            showLoader(false);
        }
        else if (assignedZonesIdsArr.length == 0) {
            constructTostStates('Please select a zone');
            showLoader(false);
        } else {
            dateObj.name = agentName;
            dateObj.email = email;
            dateObj.password = password;
            dateObj.address.address_1 = address;
            dateObj.address.address_2 = apartment;
            dateObj.address.city = city;
            dateObj.address.country = country;
            dateObj.address.state = state;
            dateObj.address.city = city;
            dateObj.address.pincode = pincode;
            dateObj.address.phone = phone;

            dateObj.delivery_zone_access = assignedZonesIdsArr;

            // console.log('Do Create', dateObj);
            adminApiRequestService.postCreateDelveryAgent(dateObj, (response) => {
                if (response) {
                    // console.log(response);
                    constructTostStates(response.msg.toUpperCase(), !response.status);
                    if (response.status) {
                        setTimeout(router.back(), 2000);
                    }

                }
                showLoader(false);
            });
        }
    };

    //* to handel checkbox functionality
    const handelCheckBox = useCallback((zoneId) => {
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

    //* on search text clear
    const handleSearchChange = (value) => {
        setSearch(value);
        if (!value) {
            setFiltered([]);
        } else {
            handleSearch(value);
        }
    };


    //* Search functanility
    const handleSearch = (searchName) => {
        let filterArray = [];
        // setsearchFlag(false);
        let str = searchName.toLowerCase();
        avaliableZones.forEach((item) => {
            let arrayItem = item.warehouse.title.toLowerCase();
            let match = arrayItem.match(str);
            if (match) {
                filterArray.push(item);
                // console.log("filtered ", filterArray);
            }
        });
        if (filterArray.length > 0) {
            // console.log(filterArray);
            setFiltered(filterArray);
        } else {
            setFiltered([{ warehouse: { title: "No match found", empty: true } }]);
        }
        // setsearchFlag(true);
    };
    const handleClearButton = () => {
        setSearch();
        setFiltered([]);
    };

    //* gettinga all avaialble delivery zones
    useEffect(() => {
        showLoader(true);
        adminApiRequestService.getAllDeliveryZones((response) => {
            if (response) {
                // console.log('All avaliable Zones ', response);
                setAvaliableZones(response);
            }
            showLoader(false);
        });

    }, []);

    return (
        <SideNavBar>
            <Page
                title={pageTitle.executive.add}
                breadcrumbs={[{ content: 'Agents', onAction: () => router.back() }]}>
                <Layout>
                    <Layout.Section>
                        <Banner title="Add delivery executive to assign the warehouse orders!" status="info">
                            <List type="bullet">
                                <List.Item>Fill all mandatory fields</List.Item>
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
                                        onChange={(value) => setEmail(value.toLowerCase())}
                                        autoComplete="email"
                                        onBlur={() => validateEmail(email, constructTostStates)}
                                    />

                                    <TextField
                                        requiredIndicator
                                        value={password}
                                        label="Password"
                                        type="password"
                                        onChange={(value) => setPassword(value)}
                                    />
                                    <br />
                                    <TextStyle variation="positive">  Please save this info. User can login using the same information.</TextStyle>

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
                                    <TextField
                                        value={city}
                                        label="City"
                                        onChange={(value) => setCity(value)}
                                        autoComplete="off"
                                    />

                                    <TextField
                                        value={city} type="Text"
                                        label="City"
                                        onChange={(value) => setCity(value)}
                                        autoComplete="off"
                                    />


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
                            </FormLayout>
                        </Form>
                    </Layout.AnnotatedSection>

                    <Layout.AnnotatedSection
                        title="Zone Access"
                        description="Check mark zones to assign this delivery agent">
                        <Card sectioned>

                            <TextField
                                value={search}
                                onChange={handleSearchChange}
                                autoComplete="off"
                                placeholder="Search by warehouse"
                                clearButton
                                onClearButtonClick={handleClearButton}
                            />

                            <ResourceList
                                resourceName={{ singular: 'warehouse', plural: 'warehouses' }}
                                items={filtered.length ? filtered.map((zone, index) => {
                                    return {
                                        key: index,
                                        id: zone.warehouse?._id,
                                        name: zone.warehouse?.title,
                                        warehouse_address: zone?.warehouse?.address?.address_1,
                                        warehouse_zones: zone?.zones,
                                        empty: zone?.warehouse?.empty
                                    };
                                }) : avaliableZones?.map((zone, index) => {
                                    return {
                                        key: index,
                                        id: zone.warehouse._id,
                                        name: zone.warehouse.title,
                                        warehouse_address: zone.warehouse.address?.address_1,
                                        warehouse_zones: zone.zones,
                                    };
                                })
                                }

                                renderItem={(item) => {
                                    const { id, name, warehouse_address, warehouse_zones, empty } = item;
                                    const media = !empty && <Thumbnail size="small" source="/images/InventoryMajor.svg" alt="Zone" />;
                                    return (
                                        <ResourceItem id={id} media={media} accessibilityLabel={`View details for ${id}`}>
                                            <Stack wrap={false}>
                                                <TextStyle variation="strong">{name}</TextStyle>
                                                <TextStyle variation="subdued">{warehouse_address}</TextStyle>
                                            </Stack>

                                            <Stack>{warehouse_zones?.map((zone, index) => {
                                                return (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                                                        <Checkbox checked={assignedZonesIdsArr.includes(zone._id)}
                                                            onChange={() => handelCheckBox(zone._id)}
                                                        />{zone.title}
                                                    </div>
                                                )
                                            })}</Stack>
                                        </ResourceItem>

                                    );
                                }}
                            />
                        </Card>
                        <br />
                        <Stack alignment="center" distribution="equalSpacing">
                            <Button plain destructive onClick={() => router.back()}>
                                Back
                            </Button>
                            <Button primary onClick={handelSubmit}>
                                Create
                            </Button>
                        </Stack>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </SideNavBar>
    );
};

AddAgent.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true
}

export default AddAgent;
