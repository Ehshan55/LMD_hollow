import React, { useContext, useEffect, useState } from 'react';
import { Banner, Button, Card, Form, FormLayout, Layout, Page, ResourceItem, ResourceList, Stack, TextField, TextStyle, Checkbox, List, Collapsible, TextContainer, Badge, Thumbnail } from '@shopify/polaris';
import { useRouter } from 'next/router';


import SideNavBar from '../../../components/sideNavBar';

import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';
import { validateLogin } from '../../../contexts/AuthContext';

import AdminApiService from '../../../apiservices/adminApiService';
import EmptyResourceList from '../../../components/emptyResourceList';
const adminApiRequestService = new AdminApiService();

const routePlanByZone = () => {
    const Router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [avaliableZones, setAvaliableZones] = useState([]);

    const [search, setSearch] = useState();

    const [filtered, setFiltered] = useState([]);
    const [searchFlag, setsearchFlag] = useState(true);


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
        setsearchFlag(false);
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
        setsearchFlag(true);
    };
    //* to cleare search field and actions
    const handleClearButton = () => {
        setSearch();
        setFiltered([]);
    };

    //* navigating to route plan page
    const handleNavigateToCreateRoute = (zoneId, zoneTitle) => {
        Router.push({
            pathname: '/admin/routes/view-routes',
            query: { title: zoneTitle, id: zoneId },
        });
    }

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
                title="Deliver route">
                <Layout>
                    <Layout.Section>
                        <Banner title="Select a warehouse zone to define their delivery route" status="info">
                        </Banner>
                    </Layout.Section>


                    <Layout.AnnotatedSection
                        title="Warehouse Zone"
                        description="All availabe zones">
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
                                emptyState={
                                    avaliableZones.length == 0 && <EmptyResourceList heading="No warehouse zone created yet" content="Please create warehouse zone first." />}
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
                                        id: zone.warehouse?._id,
                                        name: zone.warehouse?.title,
                                        warehouse_address: zone.warehouse?.address?.address_1,
                                        warehouse_zones: zone.zones,
                                    };
                                })
                                }

                                renderItem={(item) => {
                                    const { id, name, warehouse_address, warehouse_zones, empty } = item;
                                    const media = !empty && <Thumbnail size="small" source="/images/InventoryMajor.svg" alt="Zone" />;
                                    return (
                                        <ResourceItem id={id} media={media} accessibilityLabel={`View details for ${id}`}>
                                            <Stack>
                                                <Badge>
                                                    <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                                                </Badge>
                                                <div>{warehouse_address}</div>
                                            </Stack>
                                            <Stack>
                                                <div >{warehouse_zones?.map((zone, index) => {
                                                    return (
                                                        <div key={index} style={{ padding: 5 }}>
                                                            <Button plain onClick={() => handleNavigateToCreateRoute(zone._id, zone.title)}> {zone.title}</Button>
                                                        </div>
                                                    )
                                                })}</div>
                                            </Stack>
                                        </ResourceItem>

                                    );
                                }}
                            />
                        </Card>

                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </SideNavBar>
    );
};

routePlanByZone.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default routePlanByZone;
