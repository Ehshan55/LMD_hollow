import { Badge, Caption, Card, FormLayout, Frame, Heading, Layout, Loading, Page, ResourceItem, ResourceList, Select, TextContainer, TextField, TextStyle, Thumbnail, TopBar } from '@shopify/polaris';

import React, { useCallback, useEffect, useState } from 'react';

import ToastUp from '../../../components/toast';
import PageSkeleton from '../../../components/skeletons/pageSkeleton';

import { uppercase, remove_ } from '../../../utils/textFormate';
import { badgeStatus, badgeProgress } from '../../../utils/customBadge';
import { dateFormate } from '../../../utils/dateFormate';

import { validateLogin } from '../../../contexts/AuthContext';

import DeliveryApiService from '../../../apiservices/deliveryApiService';

const apiRequest = new DeliveryApiService();

const OrderDetails = ({ orderId }) => {
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState();

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const [toastActive, setToastActive] = useState(false);

  const [allowedDeliveryStatus, setAllowedDeliveryStatus] = useState([]);
  let options = [];
  let statusOptionObj = {};

  const [orderDetails, setOrderDetails] = useState();
  const [Title, setTitle] = useState();
  const [date, setDate] = useState();
  const [status, setStatus] = useState({ financial: '', delivery: '', fulfillment: '', });

  const [itemsArray, setItemsArray] = useState([]);

  const [fetchingData, setFetchingData] = useState(false);

  const toggleToastActive = useCallback(() => setToastActive((toastActive) => !toastActive), [],);

  //* On update button press
  const handleDeleveryStatus = useCallback(() => {
    setUpdating(true);
    const reqData = {
      delivery_status: selected,
      delivery_notes: notes,
      reschedule_date: rescheduleDate,
    };
    if (orderId) {
      apiRequest.putDeliveryOrderUpdateById(orderId, reqData, (response) => {
        if (response) {
          // console.log(response);
          setOrderDetails(response.data);
          setMessage(response.msg.toUpperCase());
          toggleToastActive();
          setUpdating(false);
        } else {
          setMessage('Unfortunate Error Occured');
          toggleToastActive();
          setUpdating(false);
        }
      });
      resetStates();
    }
    else {
      constructTostStates('Cannot update status. Please try again');
    }
  });

  const resetStates = () => {
    setSelected('');
    setNotes('');
    setRescheduleDate('');
  };

  //* On cancel button press
  const handleCancel = () => {
    resetStates();
  };

  //* this function sets select options dynamically
  const makeOptionObjArr = (allowedUpdateStates) => {
    let defaultObj = { label: 'Select', value: '' };
    options.push(defaultObj);
    allowedUpdateStates.forEach((statusOption) => {
      statusOptionObj = { label: statusOption.name, value: statusOption.val };
      options.push(statusOptionObj);
    });
    setAllowedDeliveryStatus(options);
    // console.log(options);
  };

  //* Sets Order item array object to list
  const setItems = (arr) => {
    // console.log('Inside setItem ', arr);
    const arrObj = [];
    setItemsArray([]);
    arr?.line_items?.forEach((item) => {
      const obj = {
        id: item.id,
        name: item.name,
        subtitle: item.variant_title,
        count: `Qty : ${item.fulfillable_quantity}`,
      };
      arrObj.push(obj);
      setItemsArray((prevstate) => {
        return [...prevstate, obj];
      });
    });
  };

  //* Disables the Update button on invalid form
  const formVamidation = () => {
    if (selected == '') return true;
    else if (selected == 'reschedule' && !rescheduleDate) return true;
    else if (orderDetails.delivery_status == 'delivered') return true;
    else if (orderDetails.delivery_status == 'canceled') return true;
    else return false;
  };

  // * setting up order details
  useEffect(() => {
    setFetchingData(true);
    console.log(orderId)
    if (orderId) {
      apiRequest.getDeliveryOrdersDetailsById(orderId, (response) => {
        // console.log('Detailed Order response ', response);
        if (response) {
          let orderDetails = response?.order_details;
          makeOptionObjArr(response.delivery_status_available);
          setOrderDetails(orderDetails);
          setTitle(orderDetails.name);
          setDate(orderDetails.created_at);
          setStatus({
            financial: orderDetails.financial_status,
            delivery: orderDetails.delivery_status,
            fulfillment: orderDetails.fulfillment_status,
          });
          // setItems is a function
          setItems(orderDetails);
          setFetchingData(false);

        }
      });
    }
  }, []);

  const toastMarkup = toastActive ? (
    <ToastUp text={message} toggleToastActive={toggleToastActive} />
  ) : null;

  return (
    <Frame
      topBar={<TopBar />}>

      {fetchingData && <Loading />}
      {orderDetails ? (
        <Page
          title={Title || 'orderId'}
          subtitle="Order Details"
        >
          <div className="align-horrozontal">
            <Heading>
              Order Placed : {dateFormate(date) || ' 2021-10-24 12:31:08'}
            </Heading>
            <Badge
              status={badgeStatus(status?.financial)}
              progress={badgeProgress(status?.financial)}
            >
              {uppercase(status?.financial)}
            </Badge>
            <Badge
              status={badgeStatus(status?.delivery)}
              progress={badgeProgress(status?.delivery)}
            >
              {remove_(status?.delivery, true)}
            </Badge>
            <Badge
              status={badgeStatus(status?.fulfillment || 'Unfulfilled')}
              progress={badgeProgress(status?.fulfillment || 'Unfulfilled')}
            >
              {uppercase(status?.fulfillment || 'Unfulfilled')}
            </Badge>
          </div>

          <Layout>
            <Layout.Section twoThird>
              <Card
                title={`Products(${orderDetails?.line_items?.length})`}
                sectioned
              >
                {itemsArray.length > 0 ? (
                  <ResourceList
                    resourceName={{ singular: 'customer', plural: 'customers' }}
                    items={itemsArray}
                    renderItem={(item) => {
                      const { id, url, name, subtitle, count } = item;
                      const media = (
                        <Thumbnail
                          source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                          alt="Black choker necklace"
                        />
                      );

                      return (
                        <ResourceItem
                          id={id}
                          // url={url}
                          // media={media}
                          accessibilityLabel={`View details for ${name}`}
                        >
                          <h3>
                            <TextStyle variation="strong">{name}</TextStyle>
                          </h3>
                          <div>{subtitle}</div>
                          <div>{count}</div>
                        </ResourceItem>
                      );
                    }}
                  />
                ) : (
                  'No Data'
                )}
              </Card>
              {/*  */}

              <Card
                title="Delivery Timeline"
                secondaryFooterActions={[
                  {
                    content: 'Cancel',
                    destructive: true,
                    onAction: handleCancel,
                    disabled: formVamidation(),
                  },
                ]}
                primaryFooterAction={{
                  content: 'Update',
                  onAction: handleDeleveryStatus,
                  loading: updating,
                  disabled: formVamidation(),
                }}
              >
                <Card.Section title="Timeline">
                  <div className="timeline">
                    {orderDetails.delivery_notes?.map(
                      (update, index) =>
                        update && (
                          <div key={index} className="timeline_container right">
                            <div className="timeline_content">
                              <Heading>{remove_(update.new_status)}</Heading>
                              <Caption>
                                <strong>Note:</strong> {update.delivery_notes}
                              </Caption>
                              {update.reschedule_date && (
                                <Caption>
                                  <strong>Reschedule date:</strong>{' '}
                                  {update.reschedule_date}
                                </Caption>
                              )}
                              <Caption>
                                <strong>Status updated at:</strong>{' '}
                                {dateFormate(update.updated_at)}
                              </Caption>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                  {orderDetails.delivery_notes?.length == 0 && (
                    <h2>
                      No activity On this order
                      <br /> Delivery status not yet updated
                    </h2>
                  )}
                </Card.Section>
                <Card.Section title="Update Delivery Status">
                  <FormLayout>
                    <FormLayout.Group>
                      <Select
                        value={selected}
                        options={allowedDeliveryStatus}
                        label="Status"
                        onChange={(value) => setSelected(value)}
                        autoComplete="off"
                      />
                      <TextField
                        value={notes}
                        label={
                          selected == 'reschedule' || selected == 'canceled'
                            ? 'Reason'
                            : 'Note'
                        }
                        placeholder={
                          selected == 'reschedule' || selected == 'canceled'
                            ? `${uppercase(selected)} reason`
                            : 'Delivery Notes'
                        }
                        onChange={(value) => setNotes(value)}
                        autoComplete="on"
                      />
                      {selected == 'reschedule' && (
                        <TextField
                          value={rescheduleDate}
                          label="Date"
                          placeholder="Reschedule Date"
                          onChange={(value) => setRescheduleDate(value)}
                          type="date"
                          autoComplete="off"
                        />
                      )}
                    </FormLayout.Group>
                  </FormLayout>
                </Card.Section>
              </Card>
            </Layout.Section>

            <Layout.Section oneThird>
              <Card title="Customer Details">
                <Card.Section title="NAME">
                  <p>
                    {orderDetails.customer?.first_name}{' '}
                    {orderDetails.customer?.last_name}
                  </p>
                </Card.Section>

                <Card.Section title="CONTACT INFORMATION">
                  <p>{orderDetails?.customer?.email}</p>
                  <p>{orderDetails?.customer?.phone}</p>
                </Card.Section>
              </Card>

              <Card title="SHIPPING">
                <Card.Section title="Address">
                  <TextContainer spacing="tight">
                    <p>
                      {orderDetails?.customer?.first_name}{' '}
                      {orderDetails?.customer?.last_name}
                    </p>
                    <p>{orderDetails?.customer?.company} </p>
                    <p>{orderDetails?.shipping_address?.address1}</p>
                    <p>{orderDetails?.shipping_address?.address2}</p>
                    <p>
                      {orderDetails?.shipping_address?.city},{' '}
                      {orderDetails?.shipping_address?.province} -{' '}
                      {orderDetails?.shipping_address?.zip}
                    </p>
                    <p>{orderDetails?.shipping_address?.country}</p>
                    <p>{orderDetails?.shipping_address?.phone}</p>
                  </TextContainer>
                </Card.Section>
              </Card>

              <Card title="Notes">
                <Card.Section
                  title={orderDetails?.note || 'No notes from customer'}
                ></Card.Section>
              </Card>

              <Card title="Order Assign">
                <Card.Section title="Order is assigned for delivery">
                  <TextContainer spacing="tight">
                    <p>Assigned to : {orderDetails?.assigned_to?.name}</p>
                    <p>Email : {orderDetails?.assigned_to?.email}</p>
                    <p>Phone : {orderDetails?.assigned_to?.address?.phone}</p>
                  </TextContainer>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      ) : (
        <PageSkeleton />
      )}

      {toastMarkup}
    </Frame>
  );
};

OrderDetails.getInitialProps = async (ctx) => {
  validateLogin(ctx);

  let order_id = "";
  if (ctx.query) {
    console.log(ctx.query);
    let queryParams = ctx.query.orderDetails[0];
    order_id = queryParams;
  }
  return new Promise((resolve, reject) => {
    try {
      if (order_id) {
        resolve({ orderId: order_id })
      } else {
        console.log('order_id not found');
      }

    } catch (error) {
      console.log("Error : ", error);
    }
  });
}

export default OrderDetails;
