import { Avatar, Banner, Card, Layout, Page, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';

import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import { validateLogin } from '../../../contexts/AuthContext';

import ApiService from '../../../apiservices/deliveryApiService';
import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';
import SideNavBarDelivery from '../../../components/sideNavBarDelivery';
import EmptyResourceList from '../../../components/emptyResourceList';
const deliveryApiRequestService = new ApiService();

const DeliveryRoute = () => {

  const router = useRouter();

  const { showLoader } = useContext(LoaderContext);
  const { ordreAnalytics, setTopLoading } = useContext(DataContext);

  const [deliveryRoutes, setDeliveryRoutes] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // *To Navigate to Route details page
  const handleNavigateToRouteDetails = (route) => {
    // console.log(route);
    router.push({
      pathname: '/delivery/routes/route-details',
      query: { route: route._id },
    });
  }


  //* using another useEffect for just order refreshing while pagination and filtering
  useEffect(() => {
    showLoader(true);
    setTopLoading(true);
    if (ordreAnalytics) {
      setIsLoading(true);
      deliveryApiRequestService.getDeliveryRoutesForDelivery((responseArray) => {
        if (responseArray) {
          // console.log(responseArray);
          setDeliveryRoutes(responseArray);
          showLoader(false);
          setTopLoading(false);
          setIsLoading(false);
        } else {
          console.log('Undefined Response from getDeliveryRoutesForDelivery ',);
          showLoader(false);
          setTopLoading(false);
          setIsLoading(false);
        }
      });
    }

  }, [])



  return (
    <SideNavBarDelivery>
      <Page title="Delivery Routes">
        <Layout>
          <Layout.Section>
            <Banner title="All assigned routes will list here" status="info">
              <p>Delivery should be according to the orders arrenged in each route</p>
            </Banner>
          </Layout.Section>
          <Layout.AnnotatedSection
            title="All delivery routes"
            description="You can execute all available delivery routes here"
          >
            <Card>
              <ResourceList
                emptyState={deliveryRoutes.length == 0 && <EmptyResourceList heading="No delivery routes yet" content="Admin has not assigned any routes yet" />}
                loading={isLoading}
                resourceName={{ singular: 'route', plural: 'routes' }}
                items={deliveryRoutes?.map((route, index) => {
                  return {
                    route: route,
                    id: route._id,
                    name: route.title,
                    orders: route.orders.length,

                  };
                })}
                renderItem={(item) => {
                  const { route, id, name, orders } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'View',
                        onAction: () => handleNavigateToRouteDetails(route),
                      },
                    ]
                    : null;
                  const media = <Avatar customer size="medium" name={name} />;

                  return (
                    <ResourceItem
                      route={route}
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${id}`}
                      shortcutActions={shortcutActions}
                      onClick={() => handleNavigateToRouteDetails(route)}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
                      <div>Orders: {orders}</div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.AnnotatedSection>
        </Layout>

      </Page>
    </SideNavBarDelivery>
  )
}

DeliveryRoute.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true
}

export default DeliveryRoute
