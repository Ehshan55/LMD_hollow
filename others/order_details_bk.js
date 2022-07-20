import {
  Badge, Button, Caption, Card, FormLayout, Frame, Heading, Layout, Page, ResourceItem, ResourceList, Select, Stack, TextContainer, TextField, TextStyle, Thumbnail,
} from '@shopify/polaris';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';

import orderService from '../apiservices/orderService';
const OrderApiRequestService = new orderService();

import CookiesJs from 'js-cookie';

import PageSkeleton from '../components/skeletons/pageSkeleton';
import ToastUp from '../components/toast';

import { uppercase, remove_ } from '../utils/textFormate';
import { badgeStatus, badgeProgress } from '../utils/customBadge';
import { dateFormate } from '../utils/dateFormate';

import { validateLogin } from '../contexts/AuthContext';

import LoaderContext from '../contexts/LoaderContext';

const MutualOrderDetails = ({ router }) => {
  const { showLoader } = useContext(LoaderContext);

  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState();

  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const handleNote = useCallback((value) => setNotes(value), []);
  const handleRescheduleDate = useCallback(
    (value) => setRescheduleDate(value),
    [],
  );

  const [allowedDeliveryStatus, setAllowedDeliveryStatus] = useState([]);
  let options = [];
  let statusOptionObj = {};

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

  // const [deliveryTimeline, setDeliveryTimeline] = useState([])
  const [obj, setObj] = useState([]);
  const Router = useRouter();

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const [toastActive, setToastActive] = useState(false);
  const toggleToastActive = useCallback(
    (msg) => {
      setMessage(msg);
      setToastActive((toastActive) => !toastActive);
    },
    [],
  );
  const toastMarkup = toastActive ? (
    <ToastUp text={message} toggleToastActive={toggleToastActive} />
  ) : null;

  // Delivery status updating dunction
  const handleDeleveryStatus = useCallback(() => {
    setUpdating(true);
    if (rescheduleDate != '') {
      const date = new Date(rescheduleDate);
    }
    const reqData = {
      delivery_status: selected,
      delivery_notes: notes,
      reschedule_date: rescheduleDate,
    };
    // console.log(reqData);

    OrderApiRequestService.updateOrderDeliveryStatus(orderId, reqData, (response) => {
      if (response) {
        // console.log(response);
        setOrderDetails(response.data);
        toggleToastActive(response.msg);
        setObj((prevstate) => {
          return [...prevstate, reqData];
        });
      }
      setUpdating(false);
    },
    );

    resetStates();

  });

  const resetStates = () => {
    setSelected('');
    setNotes('');
    setRescheduleDate('');
  };

  const handleCancel = () => {
    // console.log(new Date(rescheduleDate));
    resetStates();
  };

  const [orderDetails, setOrderDetails] = useState();
  const [Title, setTitle] = useState();
  const [date, setDate] = useState();
  const [status, setStatus] = useState({
    financial: '',
    delivery: '',
    fulfillment: '',
  });

  const [executiveOptionObjArr, setExecutiveOptionObjArr] = useState([]);
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const handleExecutiveSelectChange = useCallback((value) => {
    setSelectedExecutive(value);
    // console.log(value);
  }, []);

  const [orderId, setOrderId] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    let isOrderAssigned = false;
    if (router.query.orderId) {
      // Note: using cookie because id get lost when page reloads
      CookiesJs.set('orderId', router.query.orderId);
    }
    setOrderId(router.query.orderId || CookiesJs.get('orderId'));

    if (router.query.userId) {
      CookiesJs.set('userId', router.query.userId);
    }
    setUserId(router.query.userId || CookiesJs.get('userId'));

    let ordId = router.query.orderId || CookiesJs.get('orderId');
    if (ordId) {
      OrderApiRequestService.getOrderDetails(ordId, (response) => {
        // console.log('Detailed Order response ', response);
        if (response) {
          let orderDetails = response?.order_details;
          makeOptionObjArr(response.delivery_status_available),
            setOrderDetails(orderDetails);
          setTitle(orderDetails.name);
          setDate(orderDetails.created_at);
          setStatus({
            financial: orderDetails.financial_status,
            delivery: orderDetails.delivery_status,
            fulfillment: orderDetails.fulfillment_status,
          });
          setItems(orderDetails);

          if (orderDetails.assigned_to) {
            isOrderAssigned = true;
          }
        }
      });
    }

    if (!isOrderAssigned) {
      let executiveArray = [];
      let executiveObj = {};
      OrderApiRequestService.listAgents((responseArray) => {
        if (responseArray?.total_users) {
          // console.log(responseArray.total_users);
          let deliveryExecutives = responseArray.total_users;

          let defaultObj = { label: 'Select', value: '' };
          executiveArray.push(defaultObj);
          deliveryExecutives.forEach((executive) => {
            executiveObj = {
              label: `${executive.name} | ${executive.email}`,
              value: executive._id,
            };
            executiveArray.push(executiveObj);
          });
          setExecutiveOptionObjArr(executiveArray);
        }
      });

    }

  }, []);

  const [itemsArray, setItemsArray] = useState([]);
  // Makes the array object for product listing 
  const setItems = (arr) => {
    // console.log('Inside setItem ', arr);
    const arrObj = [];
    setItemsArray([]);
    arr?.line_items?.forEach((item) => {
      // console.log(item)
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

  // validation of update button
  const updateBtnValidate = () => {
    if (selected == '') return true;
    else if (selected == 'reschedule' && !rescheduleDate) return true;
    else if (orderDetails.delivery_status == 'delivered') return true;
    else if (orderDetails.delivery_status == 'canceled') return true;
    else return false;
  };

  // Assigns delivery agent form inside order details page
  const handleAssignDeliveryAgent = () => {
    // console.log(orderId);
    if (selectedExecutive) {
      showLoader(true);
      if (orderId) {
        OrderApiRequestService.postAssignOrder(
          orderId,
          selectedExecutive,
          (responseData) => {
            if (responseData) {
              // console.log('postAssignOrder >>', responseData.msg);
              if (responseData.status) {
                showLoader(false);
                window.location.reload(false);
              }
            }
          },
        );
      } else {
        console.log('Order id missing');
      }
    }
    else {
      toggleToastActive("Please select a delivery agent");
    }
  };

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  return (
    <Frame>
      {orderDetails ? (
        <Page
          breadcrumbs={[{ content: 'Products', onAction: () => router.back() }]}
          title={Title || 'OrderId'}
          subtitle="Order Details"
        >
          <Stack alignment="center">
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
          </Stack><br />

          <Layout>
            <Layout.Section twoThird>
              <Card
                title={`Products(${orderDetails?.line_items?.length})`}
                sectioned
              >
                {itemsArray.length > 0 ? (
                  <ResourceList
                    resourceName={{ singular: 'customer', plural: 'customers' }}
                    // items={orderDetails?.line_items.map((item)=>{ [
                    //   {
                    //     id: item.id,
                    //     // url: 'customers/341',
                    //     name: 'A-Line Pocket Shift in Black - Black / Italian 38',
                    //     subtitle: 'Black / Italian 38 | Qty : 1',
                    //     count: 'Qty : 1'
                    //   },
                    // ]})}
                    items={itemsArray}
                    renderItem={(item) => {
                      const { id, name, subtitle, count } = item;
                      const media = (
                        <Thumbnail
                          source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                          alt="Black choker necklace"
                        />
                      );

                      return (
                        <ResourceItem
                          id={id}
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
                  'No Items'
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
                    disabled: updateBtnValidate(),
                  },
                ]}
                primaryFooterAction={{
                  content: 'Update',
                  onAction: handleDeleveryStatus,
                  loading: updating,
                  disabled: updateBtnValidate(),
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
                              {update.delivery_notes && (<Caption>
                                <strong>Note:</strong> {update.delivery_notes}
                              </Caption>)}
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
                      No activity on this order.
                      <br /> Delivery status not yet updated.
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
                        onChange={handleSelectChange}
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
                        onChange={handleNote}
                        autoComplete="on"
                      />
                      {selected == 'reschedule' && (
                        <TextField
                          value={rescheduleDate}
                          label="Date"
                          placeholder="Reschedule Date"
                          onChange={handleRescheduleDate}
                          type="date"
                          minDate={disablePastDate}
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
                {orderDetails?.assigned_to ? (
                  <Card.Section title="Order is assigned for delivery">
                    <TextContainer spacing="tight">
                      <p>Assigned to : {orderDetails?.assigned_to?.name}</p>
                      <p>Email : {orderDetails?.assigned_to?.email}</p>
                      <p>Phone : {orderDetails?.assigned_to?.address?.phone}</p>
                    </TextContainer>
                  </Card.Section>
                ) : (
                  <Card.Section >
                    <p>No Delivery Agent assigned/available for this order.<br /> If available please select one & assign</p><br />
                    <Select
                      label="Delivery Agents"
                      options={executiveOptionObjArr}
                      onChange={handleExecutiveSelectChange}
                      value={selectedExecutive}
                    />
                    <br />
                    <Button onClick={handleAssignDeliveryAgent}>Assign</Button>
                  </Card.Section>
                )}
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

MutualOrderDetails.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return ({})
}

export default withRouter(MutualOrderDetails);
