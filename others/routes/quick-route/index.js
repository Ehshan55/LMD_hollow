import { Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, Tabs, TextStyle, Thumbnail } from '@shopify/polaris';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import EmptyResourceList from '../../../../components/emptyResourceList';
import SideNavBar from '../../../../components/sideNavBar';

import { validateLogin } from '../../../../contexts/AuthContext';

import adminApiService from '../../../../apiservices/adminApiService';
import LoaderContext from '../../../../contexts/LoaderContext';
import ConfirmationModalPopup from '../../../../components/confirmDeleteModal';
const adminApiRequestService = new adminApiService();

const viewRoutesOfZone = () => {

    const { showLoader } = useContext(LoaderContext);
    const router = useRouter();
    const [mapRoutes, setMapRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [confirmationModalActive, setConfirmationModalActive] = useState(false);
    const [deletingRouteName, setDeletingRouteName] = useState('');
    const [deletingRouteId, setDeletingRouteId] = useState('');
    const [deletingRoute, setDeletingRoute] = useState(false);


    //* getting order by zone
    useEffect(() => {
        fetchQuickRoutes('unarchived');
    }, []);

    const fetchQuickRoutes = (type) => {
        showLoader(true);
        setIsLoading(true);
        adminApiRequestService.getAllDeliveryQuickMapRoutes(type, (responseData) => {
            // console.log("API Repsonse: ", responseData);
            if (responseData) {
                setMapRoutes(responseData.data);
                showLoader(false);
                setIsLoading(false);
            }
        })
    }

    // *navigating to WarehouseZones page
    const handleNavigateToViewRoute = (item) => {
        let routeId = item.id;

        router.push({
            pathname: '/admin/routes/quick-route/quick-route-update',
            query: { routeId },
        });

    }
    // *navigating to add viewRoutesOfZone
    const handleNavigateToCreateRoute = () => {
        router.push({
            pathname: '/admin/routes/quick-route/quick-route-planner',
        });

    }

    // *Delete/archive route by id
    const handleArchiveRouteModal = (item) => {
        // console.log('route_id', item);
        setConfirmationModalActive(true)
        setDeletingRouteName(item.name);
        setDeletingRouteId(item.id);
    }
    // *Delete/archive route by id
    const handleArchiveRouteById = () => {
        setDeletingRoute(true);
        // console.log('Deleting', deletingRouteId);
        adminApiRequestService.archiveDeliveryQuickMapRoutes(deletingRouteId, (responseData) => {
            console.log("API Repsonse: ", responseData);
            if (responseData.status) {
                router.reload();
            }
            setDeletingRoute(false);
        })
    }
    const [selectedTabIndex, setSelected] = useState(0);

    const handleTabChange = (selectedTabIndex) => {
        setSelected(selectedTabIndex);
        switch (selectedTabIndex) {

            case 0: {
                fetchQuickRoutes('unarchived');
                break;
            }
            case 1: {
                fetchQuickRoutes('archive');
                break;
            }

        }
    }
    const tabs = [
        {
            id: 'unarchived-routes',
            content: 'Active routes',
            accessibilityLabel: 'Active Routes',
            panelID: 'all-unarchived-routes',
        },
        {
            id: 'Archived-routes',
            content: 'Archived routes',
            accessibilityLabel: 'All Archived routes',
            panelID: 'all-archived-routes',
        },

    ];


    return (
        <SideNavBar>
            <Page title="Delivery Routes"
                breadcrumbs={[{ content: 'Route Plan', onAction: () => router.back() }]}>

                <Banner status="warning" title="Beta Release V0.1">
                    <p> This feature is in Beta Release. You can use this feature for your regular usages. </p>
                    <p> This is very helpful if you want to create a route without having any pincode mapping of zones or warehouse.</p>
                    <p> To Create a route directly from order just click on Create Route, Add Order from List and Assing it to a delivery executive.</p>
                </Banner>

                <Layout>

                    <Layout.AnnotatedSection
                        title="Map routes"
                        description="You can edit and manage all available map routes here"
                    ><br />
                        <Card>
                            <Tabs tabs={tabs} selected={selectedTabIndex} onSelect={handleTabChange}>
                                <Card.Section>

                                    <ResourceList
                                        loading={isLoading}
                                        emptyState={mapRoutes.length == 0 && <EmptyResourceList heading="No map routes yet" content="Please create one by clicking create button." />}
                                        resourceName={{ singular: 'mapRoute', plural: 'mapRoutes' }}
                                        items={mapRoutes?.map((mapRoute, index) => {
                                            return {
                                                id: mapRoute?._id,
                                                name: mapRoute?.title,
                                                order_count: mapRoute?.orders.length,
                                            };
                                        })}
                                        renderItem={(item) => {
                                            const { id, name, order_count } = item;
                                            const shortcutActions = id
                                                ? [
                                                    {
                                                        content: 'View',
                                                        onAction: () => handleNavigateToViewRoute(item),
                                                    },
                                                    {
                                                        content: selectedTabIndex == 0 ? 'Archive' : 'Unarchive',
                                                        onAction: () => handleArchiveRouteModal(item),
                                                        destructive: selectedTabIndex == 0 ? true : false
                                                    },
                                                ]
                                                : null;
                                            const media = <Thumbnail size="small" source="/images/LocationMajor.svg" alt="viewRoutesOfZone" />;

                                            return (
                                                <ResourceItem
                                                    id={id}
                                                    media={media}
                                                    accessibilityLabel={`View details for ${name}`}
                                                    shortcutActions={selectedTabIndex == 0 && shortcutActions}
                                                    onClick={() => handleNavigateToViewRoute(item)}
                                                >
                                                    <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                                                    <div>{'No.of Orders: ' + order_count}</div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />

                                </Card.Section>
                            </Tabs>

                        </Card>
                        <br></br>
                    </Layout.AnnotatedSection>
                </Layout>

                {selectedTabIndex == 0 && <PageActions
                    primaryAction={{
                        loading: isLoading,
                        content: mapRoutes.length != 0 ? 'Add Route' : 'Create Route',
                        onAction: handleNavigateToCreateRoute,
                    }}
                />}
            </Page>
            <ConfirmationModalPopup
                modalActive={confirmationModalActive}
                cloesModalActive={() => setConfirmationModalActive(false)}
                title={'Archive ' + deletingRouteName + '?'}
                btntxt={'Archive'}
                action={handleArchiveRouteById}
                destructive={true}
                subtitle={'Are you sure?'}
                loading={deletingRoute} />
        </SideNavBar>
    );
};

viewRoutesOfZone.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default viewRoutesOfZone;
