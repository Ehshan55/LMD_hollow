import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApiService from '../../../apiservices/deliveryApiService';
import SideNavBarDelivery from '../../../components/sideNavBarDelivery';
import { Badge, Banner, Button, Card, IndexTable, Page, TextStyle } from '@shopify/polaris';
import EmptyDataState from '../../../components/emptyDataState';
import { dateFormate } from '../../../utils/dateFormate';
import { badgeProgress, badgeStatus } from '../../../utils/customBadge';
import { remove_, uppercase } from '../../../utils/textFormate';
import LoaderContext from '../../../contexts/LoaderContext';
const deliveryApiRequestService = new ApiService();
const RouteDetails = () => {

  const { showLoader } = useContext(LoaderContext);

  const [routeName, setRouteName] = useState();
  const [routeOrders, setRouteOrders] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //* To open order details page
  const handelOrderDetails = (orderId) => {
    window.open(`/delivery/order-details/${orderId}`, '_blank');
  };


  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    showLoader(true);
    if (router.query.route) {
      deliveryApiRequestService.getDeliveryRouteDetailsForDelivery(router.query.route, (response) => {
        if (response) {
          setRouteName(response.title);
          setRouteOrders(response.orders);
          setIsLoading(false);
          showLoader(false);
        }
      })
    } else {
      console.log('Route Id missing');
      setIsLoading(false);
      showLoader(false);
    }
  }, [])

  const rowMarkup = routeOrders?.map((order, index) => (
    <IndexTable.Row id={order._id} key={index} position={index}>

      <IndexTable.Cell><TextStyle variation="strong">{index + 1}</TextStyle> </IndexTable.Cell>
      <IndexTable.Cell><TextStyle variation="strong">{order?.name}</TextStyle> </IndexTable.Cell>
      <IndexTable.Cell>{order.shipping_address?.name}</IndexTable.Cell>
      <IndexTable.Cell>{order.zone_id?.title}</IndexTable.Cell>
      <IndexTable.Cell>{dateFormate(order.createdAt)}</IndexTable.Cell>

      <IndexTable.Cell>
        <Badge status={badgeStatus(order.delivery_status)} progress={badgeProgress(order.delivery_status)}> {remove_(order.delivery_status, true)} </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge status={badgeStatus(order.fulfillment_status || 'Unfulfilled')} progress={badgeProgress(order.fulfillment_status || 'Unfulfilled')}>
          {uppercase(order.fulfillment_status || 'Unfulfilled')}
        </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Button plane onClick={() => { handelOrderDetails(order._id) }}> View </Button>
      </IndexTable.Cell>

    </IndexTable.Row>
  ));


  return (
    <SideNavBarDelivery>
      <Page title={routeName} breadcrumbs={[{ content: 'Back', onAction: () => router.back() }]}>
        <Banner title="Delivery execution should be attempted serial wise" status="info">
          {/* <p>Deliveered and </p> */}
        </Banner>
        <br />
        <Card>

          {routeOrders?.length ? <IndexTable
            // resourceName={resourceName}
            // loading={searching}
            selectable={false}
            itemCount={routeOrders?.length}
            emptyState={<EmptyDataState title="No Orders Yet" message="" />}
            headings={[
              { title: 'Sl.No' },
              { title: 'Order No.' },
              { title: 'Customer Name' },
              { title: 'Delivery Zone' },
              { title: 'Order Date' },
              { title: 'Delivery Status' },
              { title: 'Order Status' },
              { title: 'Action' },
            ]}
          >
            {rowMarkup}

          </IndexTable> : isLoading ? <EmptyDataState title="Please wait" message="Fetching orders..." /> : <EmptyDataState title="No Orders Found" message="Orders will list when admin will assign you for this route" />}

        </Card>

      </Page>
    </SideNavBarDelivery>
  )
}

export default RouteDetails