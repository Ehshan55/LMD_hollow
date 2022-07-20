import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle } from '@shopify/polaris';
import { useRouter } from 'next/router';

import SideNavBar from '../../../../components/sideNavBar';
import EmptyResourceList from '../../../../components/emptyResourceList';

import { DataContext } from '../../../../contexts/DataContext';
import LoaderContext from '../../../../contexts/LoaderContext';
import { validateLogin } from '../../../../contexts/AuthContext';

import { pageTitle } from '../../../../utils/hardCoded';
import validateEmail from '../../../../utils/validateEmail';

import adminApiService from '../../../../apiservices/adminApiService';
const ApiRequestService = new adminApiService();

const AddManager = () => {

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


    const [warehouses, setWarehouses] = useState([]);

    const [assignedWarehouse, setAssignedWarehouse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let dateObj = { user_type: 'manager', address: {} };

    useEffect(() => {
        showLoader(true);

        //* Getting all warehouses available
        ApiRequestService.getAllWarehouses((responseArray) => {
            // console.log(responseArray);
            setWarehouses(responseArray);
            setIsLoading(false);
            showLoader(false);
        });

    }, []);

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
        if (managerName && email && phone && password) {
            if (!validateEmail(email, constructTostStates)) {
                showLoader(false);
                return;
            }
            dateObj.name = managerName;
            dateObj.email = email;
            dateObj.password = password;
            dateObj.address.address_1 = address;
            dateObj.address.address_2 = apartment;
            dateObj.address.city = city;
            dateObj.address.country = country;
            dateObj.address.state = state;
            dateObj.address.pincode = pincode;
            dateObj.address.phone = phone;

            dateObj.warehouse_access = assignedWarehouse;
            if (assignedWarehouse.length) {

                if (password) {
                    // console.log('Do Create', dateObj);
                    ApiRequestService.postCreateManager(dateObj, (response) => {
                        if (response) {
                            showLoader(false);
                            constructTostStates(response.msg.toUpperCase(), !response.status);
                            if (response.status) {
                                setTimeout(router.back(), 2000);
                            }
                        }
                    });
                }
                else {
                    showLoader(false);
                    constructTostStates('Please provide password, true');
                }

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
                title={pageTitle.manager.add}
                breadcrumbs={[{ content: 'Back', onAction: () => router.back() }]}
            >
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
                                    <TextField
                                        requiredIndicator
                                        value={password}
                                        type="password"
                                        label="Password"
                                        onChange={(value) => setPassword(value)}
                                    />
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
                                    const { id, name, email, warehouse_address, checkbox } = item;
                                    // const shortcutActions = id
                                    //     ? [
                                    //         {
                                    //             content: 'View',
                                    //             onAction: () =>
                                    //                 props.manageWarehousePage(id, 'Edit Manager'),
                                    //         },
                                    //     ]
                                    //     : null;

                                    return (
                                        <ResourceItem
                                            id={id}
                                            accessibilityLabel={`View details for ${id}`}
                                        // shortcutActions={shortcutActions}
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
                                Create
                            </Button>
                        </Stack>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </SideNavBar>
    );
};

AddManager.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}
export default AddManager;
