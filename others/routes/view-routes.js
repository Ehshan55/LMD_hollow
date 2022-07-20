import { Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle, Thumbnail } from '@shopify/polaris';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import EmptyResourceList from '../../../components/emptyResourceList';
import SideNavBar from '../../../components/sideNavBar';

import { validateLogin } from '../../../contexts/AuthContext';
import { DataContext } from '../../../contexts/DataContext';

import { buttonName } from '../../../utils/hardCoded';

import adminApiService from '../../../apiservices/adminApiService';
import LoaderContext from '../../../contexts/LoaderContext';
const adminApiRequestService = new adminApiService();

const viewRoutesOfZone = () => {

    const { showLoader } = useContext(LoaderContext);
    const router = useRouter();
    const [mapRoutes, setMapRoutes] = useState([]);
    const [zoneTitle, setZoneTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [zoneId, setZoneId] = useState('');

    //* getting order by zone
    useEffect(() => {
        let id = '';
        let route_title = '';
        const params = new URLSearchParams(window.location.search);
        if (params.has('id')) {
            id = params.get('id');
            route_title = params.get('title');
        }
        let zone_id = router.query.id || id;
        // console.log(zone_id);
        setZoneId(zone_id);
        setZoneTitle(route_title);
        if (zone_id) {
            showLoader(true);
            setIsLoading(true);
            adminApiRequestService.getDeliveryMapRouteByZoneId(zone_id, '', (responseData) => {
                // console.log(responseData);
                if (responseData) {
                    setMapRoutes(responseData);
                    showLoader(false);
                    setIsLoading(false);

                }
            })
        } else {
            showLoader(false);
            setIsLoading(false);
            // console.log("Zone id found");
        }


    }, []);

    // *navigating to WarehouseZones page
    const handleNavigateToViewRoute = (item) => {
        let routeId = item.id;

        router.push({
            pathname: '/admin/routes/route-planner',
            query: { zoneId, zoneTitle, routeId },
        });

    }
    // *navigating to add viewRoutesOfZone
    const handleNavigateToCreateRoute = () => {
        // console.log('item', item);
        let routeId = '';
        router.push({
            pathname: '/admin/routes/route-planner',
            query: { zoneId, zoneTitle, routeId },
        });

    }

    return (
        <SideNavBar>
            <Page title={"Delivery Routes - " + zoneTitle}
                breadcrumbs={[{ content: 'Route Plan', onAction: () => router.back() }]}>
                <Layout>
                    <Layout.Section>
                        <Banner title="Listing delivery routes of selected warehouse zone" status="info">
                            <p>A zone may have multiple delivery routes</p>
                        </Banner>
                    </Layout.Section>
                    <Layout.AnnotatedSection
                        title="Map routes"
                        description="You can edit and manage all available map routes here"
                    >
                        <Card>
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
                                        ]
                                        : null;
                                    const media = <Thumbnail size="small" source="/images/LocationMajor.svg" alt="viewRoutesOfZone" />;

                                    return (
                                        <ResourceItem
                                            id={id}
                                            media={media}
                                            accessibilityLabel={`View details for ${name}`}
                                            shortcutActions={shortcutActions}
                                            onClick={() => handleNavigateToViewRoute(item)}
                                        >
                                            <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                                            <div>{'No.of Orders: ' + order_count}</div>
                                        </ResourceItem>
                                    );
                                }}
                            />
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>

                <PageActions
                    primaryAction={{
                        loading: isLoading,
                        content: mapRoutes.length != 0 ? 'Add Route' : 'Create Route',
                        onAction: handleNavigateToCreateRoute,
                    }}
                />
            </Page>
        </SideNavBar>
    );
};

viewRoutesOfZone.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true;
}

export default viewRoutesOfZone;
