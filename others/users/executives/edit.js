import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Banner, Button, Card, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle, Checkbox, List, Collapsible, TextContainer, Badge, Thumbnail } from '@shopify/polaris';
import { useRouter } from 'next/router';

import validateEmail from '../../../../utils/validateEmail';
import { pageTitle } from '../../../../utils/hardCoded';

import SideNavBar from '../../../../components/sideNavBar';

import { validateLogin } from '../../../../contexts/AuthContext';
import LoaderContext from '../../../../contexts/LoaderContext';
import { DataContext } from '../../../../contexts/DataContext';

import AdminApiService from '../../../../apiservices/adminApiService';
const adminApiRequestService = new AdminApiService();

const EditAgent = () => {
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

    const [togglePasswordResetBtn, setTogglePasswordResetBtn] = useState(false);

    let dateObj = { user_type: 'vendor', address: {} };

    //* making an array only of ids
    const makeAssignedZonesIdsArr = (zone_access) => {
        let zone_access_ids = [];
        zone_access.forEach((zone) => {
            zone_access_ids.push(zone._id);
        });
        setAssignedZonesIdsArr(zone_access_ids);
    };

    //* on Update Button Click
    const handelSubmit = () => {
        showLoader(true);
        if (!agentName || !email || !phone) {
            constructTostStates('Please fill mandatory fields');
            showLoader(false);
        }
        else if (!validateEmail(email, constructTostStates)) {
            showLoader(false);
        }
        else if (assignedZonesIdsArr.length == 0) {
            constructTostStates('Please select a zone');
            showLoader(false);
        } else {

            dateObj.name = agentName;
            dateObj.email = email;
            dateObj.address.address_1 = address;
            dateObj.address.address_2 = apartment;
            dateObj.address.city = city;
            dateObj.address.country = country;
            dateObj.address.state = state;
            dateObj.address.city = city;
            dateObj.address.pincode = pincode;
            dateObj.address.phone = phone;

            dateObj.delivery_zone_access = assignedZonesIdsArr;

            if (router.query.id) {
                // console.log('Do Edit with', dateObj);
                adminApiRequestService.putUpdateDelveryAgent(router.query.id, dateObj, (response) => {
                    if (response) {
                        // console.log(response);
                        setTogglePasswordResetBtn(false);
                        constructTostStates(response.msg.toUpperCase(), !response.status);
                    }
                    showLoader(false);
                });
            }
        }
    };

    //* to update password
    const handlePasswordUpdate = () => {
        showLoader(true);
        if (router.query.id) {
            if (togglePasswordResetBtn) {
                if (password) {
                    adminApiRequestService.putUpdatePasswordDelveryAgent(router.query.id, password, (response) => {
                        if (response) {
                            // console.log(response);
                            setTogglePasswordResetBtn(false);
                            constructTostStates(response.msg.toUpperCase(), !response.status);
                        }
                        showLoader(false);
                    },
                    );
                }
                else {
                    constructTostStates('Please provide new password');
                    showLoader(false);
                }
            }
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

    //* on search text input
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

    //* on search text clear
    const handleClearButton = () => {
        setSearch();
        setFiltered([]);
    };

    //* getting agent details and delivery zones
    useEffect(() => {
        showLoader(true);
        if (router.query.id) {
            adminApiRequestService.getDeliveryAgentDetailsById(router.query.id, (response) => {
                // console.log(response);
                if (response) {
                    let agent = response;
                    setAgentName(agent?.name);
                    setAddress(agent.address?.address_1);
                    setApartment(agent.address?.address_2);
                    setEmail(agent?.email);
                    setCountry(agent.address?.country);
                    setState(agent.address?.state);
                    setCity(agent.address?.city);
                    setPincode(agent.address?.pincode);
                    setPhone(agent.address?.phone);
                    makeAssignedZonesIdsArr(agent.delivery_zone_access);
                    showLoader(false);
                }
            });
        }
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
                title={pageTitle.executive.edit}
                breadcrumbs={[{ content: 'Agents', onAction: () => router.back() }]}
            >
                <Layout>
                    <Layout.Section>
                        <Banner title="Delivery executive updating notes" status="info">
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
                                    {togglePasswordResetBtn &&
                                        <>
                                            <TextField
                                                requiredIndicator
                                                value={password}
                                                label="Enter new password"
                                                // type="password"
                                                onChange={(value) => setPassword(value)}
                                            /></>}
                                    <br />
                                    <Stack distribution="trailing">
                                        {togglePasswordResetBtn && <Button primary onClick={handlePasswordUpdate}>Update</Button>}
                                        <Button onClick={() => setTogglePasswordResetBtn(togglePasswordResetBtn => !togglePasswordResetBtn)}>{togglePasswordResetBtn ? 'Cancel' : 'Reset Password'}</Button>
                                    </Stack>
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
                                                return (<div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox checked={assignedZonesIdsArr.includes(zone._id)}
                                                        onChange={() => handelCheckBox(zone._id)} />
                                                    <TextStyle>{zone.title}</TextStyle>
                                                    {/* {assignedZonesIdsArr.includes(zone._id) ?
                                                        <Badge status="success" size="small" onClick={() => () => handelCheckBox(zone._id)}>{zone.title}</Badge> :
                                                        <Badge size="small" onClick={() => () => console.log(zone._id)}>{zone.title}</Badge>} */}
                                                </div>)
                                            })}</Stack>
                                        </ResourceItem>

                                    );
                                }}
                            />
                        </Card>
                        <br />
                        <Stack alignment="center" distribution="equalSpacing">
                            <Button plain onClick={() => router.back()}>
                                Back
                            </Button>
                            <Button primary onClick={handelSubmit}>
                                Update
                            </Button>
                        </Stack>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </SideNavBar>
    );
};

EditAgent.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default EditAgent;
