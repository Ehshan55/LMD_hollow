import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle } from '@shopify/polaris';
import { useRouter, withRouter } from 'next/router';

import EmptyResourceList from '../../../../components/emptyResourceList';
import SideNavBar from '../../../../components/sideNavBar';

import LoaderContext from '../../../../contexts/LoaderContext';
import { DataContext } from '../../../../contexts/DataContext';
import { validateLogin } from '../../../../contexts/AuthContext';

import { pageTitle } from '../../../../utils/hardCoded';
import validateEmail from '../../../../utils/validateEmail';

import adminApiService from '../../../../apiservices/adminApiService';
const apiRequestService = new adminApiService();

const EditManager = () => {
    const router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [managerName, setManagerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    const [togglePasswordResetBtn, setTogglePasswordResetBtn] = useState(false);

    let dateObj = { user_type: 'manager', address: {} };

    const [warehouses, setWarehouses] = useState([]);

    const [assignedWarehouse, setAssignedWarehouse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // *Getting managers deails and warehouses
    useEffect(() => {
        showLoader(true);
        // console.log('Inside Manager Manage page ' +managerId);
        if (router.query.id) {
            // console.log('Get Managr');

            //* Getting manager details
            apiRequestService.getManagerDetailsById(router.query.id, (responseArray) => {
                if (responseArray) {
                    // console.log(responseArray);
                    let manager = responseArray;
                    if (manager) {
                        setManagerName(manager?.name);
                        setAddress(manager.address?.address_1);
                        setApartment(manager.address?.address_2);
                        setEmail(manager.email);
                        setCity(manager.address?.city)
                        setCountry(manager.address?.country);
                        setState(manager.address?.state);
                        setPincode(manager.address?.pincode);
                        setPhone(manager.address?.phone);

                        setAssignedWarehouse(manager.warehouse_access);
                    }
                }
            });
        }
        //* Getting all warehouses available
        apiRequestService.getAllWarehouses((responseArray) => {
            // console.log(responseArray);
            setWarehouses(responseArray);
            setIsLoading(false);
            showLoader(false);
        });

    }, []);

    //* to update password
    const handlePasswordUpdate = () => {
        showLoader(true);
        if (router.query.id) {
            if (togglePasswordResetBtn) {
                if (password) {
                    apiRequestService.putUpdatePasswordManager(router.query.id, password, (response) => {
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

    //* To handle check box selection
    const handelCheck = useCallback(
        (warehouseId) => {
            // console.log(assignedWarehouse, warehouseId);
            if (assignedWarehouse.includes(warehouseId)) {
                // console.log('remove ', warehouseId);
                setAssignedWarehouse(
                    assignedWarehouse.filter((id) => id !== warehouseId),
                );
            } else {
                // console.log('add ', warehouseId);
                setAssignedWarehouse([...assignedWarehouse, warehouseId]);
            }
        },
        [assignedWarehouse],
    );

    //* On Crete/Update manager button click
    const handelSubmit = () => {
        showLoader(true);
        if (managerName && email && phone) {
            if (!validateEmail(email, constructTostStates)) {
                showLoader(false);
                return;
            }
            dateObj.name = managerName;
            dateObj.email = email;
            dateObj.address.address_1 = address;
            dateObj.address.address_2 = apartment;
            dateObj.address.city = city;
            dateObj.address.country = country;
            dateObj.address.state = state;
            dateObj.address.pincode = pincode;
            dateObj.address.phone = phone;

            dateObj.warehouse_access = assignedWarehouse;
            if (assignedWarehouse.length) {

                // console.log('Do Edit', dateObj);
                apiRequestService.putUpdateManager(router.query.id, dateObj, (response) => {
                    if (response) {
                        showLoader(false);
                        constructTostStates(response.msg.toUpperCase(), !response.status);
                    }
                },
                );

            } else {
                showLoader(false);
                constructTostStates('Please choose alteast one warehouse', true);
            }
        }
        else {
            showLoader(false);
            constructTostStates('Please fill mandatory fields', true);
        }
    };

    return (
        <SideNavBar>
            <Page
                title={pageTitle.manager.edit}
                breadcrumbs={[{ content: 'Back', onAction: () => router.back() }]}>
                <Layout>

                    <Layout.AnnotatedSection
                        title="Details"
                        description="Give this manager a short name to make it easy to identify. You’ll see this name in areas like order table">
                        <Form>
                            <FormLayout>
                                <Card sectioned>
                                    <TextField
                                        value={managerName}
                                        requiredIndicator
                                        label="Manager Name"
                                        onChange={(value) => setManagerName(value)}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        requiredIndicator
                                        value={email}
                                        type="email"
                                        label="Email"
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
                                    <p>
                                        Please save this info. User can login using the same
                                        information.
                                    </p>
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
                            </FormLayout>
                        </Form>
                    </Layout.AnnotatedSection>

                    <Layout.AnnotatedSection
                        title="Warehouse Access"
                        description="Check mark wharehouses to assign this manager"
                    >
                        <Card sectioned>
                            <ResourceList
                                loading={isLoading}
                                emptyState={warehouses.length == 0 && <EmptyResourceList heading="No warehouse yet" content="Please create one first" />}
                                resourceName={{ singular: 'warehouse', plural: 'warehouses' }}
                                items={warehouses?.map((warehouse, index) => {
                                    return {
                                        id: warehouse._id,
                                        name: warehouse.title,
                                        warehouse_address: warehouse.address?.address_1,
                                        checkbox: (
                                            <Checkbox
                                                checked={assignedWarehouse.includes(warehouse._id)}
                                                onChange={() => handelCheck(warehouse._id)}
                                            />
                                        ),
                                    };
                                })}
                                renderItem={(item) => {
                                    const { id, name, warehouse_address, checkbox } = item;

                                    return (
                                        <ResourceItem
                                            id={id}
                                            accessibilityLabel={`View details for ${id}`}
                                        >
                                            <Stack wrap={false}>
                                                {checkbox}
                                                <TextStyle variation="strong">{name}</TextStyle>
                                                <TextStyle variation="subdued">{warehouse_address}</TextStyle>
                                            </Stack>
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

EditManager.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default withRouter(EditManager);
