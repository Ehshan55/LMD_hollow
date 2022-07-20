

import { Badge, Button, Caption, Card, Form, FormLayout, Frame, Heading, Layout, Modal, Page, ResourceItem, ResourceList, Stack, Subheading, TextContainer, TextField, TextStyle, Thumbnail, TopBar } from '@shopify/polaris'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import PageSkeleton from "../../components/skeletons/pageSkeleton"
import axios from 'axios';
import { enviornment } from '../../utils/envConfig';
import { uppercase, remove_ } from '../../utils/textFormate';
import { badgeStatus, badgeProgress } from '../../utils/customBadge';
import { dateFormate } from '../../utils/dateFormate';
import validate_form from '../../utils/validateForm';
import ToastUp from '../../components/toast';
import { RedirectPage } from '../../contexts/UtilsContext';
import LocationUpdateMap from '../../components/locationUpdateMap';

const CustomerLocationUpdate = () => {
    const router = useRouter();

    const [invalidUrl, setInvalidUrl] = useState(false);

    const [orderDetails, setOrderDetails] = useState();
    const [title, setTitle] = useState();
    const [date, setDate] = useState();
    const [status, setStatus] = useState({
        financial: '',
        delivery: '',
        fulfillment: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const [itemsArray, setItemsArray] = useState([]);

    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastErrorMessage, setToastErrorMessage] = useState(false);

    const [updationToken, setupdationToken] = useState("");


    // * getting order details by uuid token
    const getOrderDeliveryForLocationUpdate = (token) => {
        setIsLoading(true);
        let baseUrl = enviornment.API_CLIENT.URL;
        try {
            axios.get(`${baseUrl}/api/v2/admin/orders/location-requesting-order/${token}`).then(response => {
                // console.log(response);
                if (response.data.status) {
                    let orderDetails = response.data.data;
                    setOrderDetails(orderDetails);
                    setTitle(orderDetails.name);
                    setDate(orderDetails.created_at);
                    setStatus({
                        financial: orderDetails.financial_status,
                        delivery: orderDetails.delivery_status,
                        fulfillment: orderDetails.fulfillment_status,
                    });
                    setItems(orderDetails);
                    setIsLoading(false);
                }
                else {
                    constructTostStates(response.data.msg, response.data.status);
                }
            })
        } catch (err) {
            // setIsLoading(false);
            console.log(err);
        }

    }


    //* Makes the array object for product listing 
    const setItems = (arr) => {
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

    // * Constructing toast
    const constructTostStates = (msg, errorMsg) => {
        setToastMessage(msg);
        setToastActive(true);
        setToastErrorMessage(errorMsg);
    }

    const toastMarkup = toastActive ? (
        <ToastUp text={toastMessage} toastErrorMessage={toastErrorMessage} toggleToastActive={() => setToastActive(false)} duration={5000} />
    ) : null;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params) {
            if (params.has('token')) {
                let token = params.get('token');
                // console.log('Got Token= ', token);
                if (token) {
                    getOrderDeliveryForLocationUpdate(token);
                    setupdationToken(token);
                } else {
                    setInvalidUrl(true);
                }
            } else {
                setInvalidUrl(true);
            }
        } else {
            setInvalidUrl(true);
        }
    }, [])

    return (<Frame>
        <TopBar />
        {/* {modal} */}
        {!invalidUrl ? !isLoading ?
            (<Page
                title={('Order Id : ' + title) || 'Order Id'}
                subtitle="Order Summary"
            >
                <Stack alignment="center">
                    <Subheading>
                        Order Placed : <b>{dateFormate(date) || ' 2021-10-24 12:31:08'}</b>
                    </Subheading>
                    <Badge
                        status={badgeStatus(status?.financial)}
                        progress={badgeProgress(status?.financial)}
                    >
                        {'Payment : ' + uppercase(status?.financial)}
                    </Badge>
                    <Badge
                        status={badgeStatus(status?.delivery)}
                        progress={badgeProgress(status?.delivery)}
                    >
                        {'Status : ' + remove_(status?.delivery, true)}
                    </Badge>
                    <Badge
                        status={badgeStatus(status?.fulfillment || 'Unfulfilled')}
                        progress={badgeProgress(status?.fulfillment || 'Unfulfilled')}
                    >
                        {'Order : ' + uppercase(status?.fulfillment || 'Unfulfilled')}
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

                    </Layout.Section>

                    <Layout.Section twoThird>
                        <Card
                            title={`Please update your delivery location`}
                            sectioned
                        >
                            <LocationUpdateMap
                                googleMapKey="AIzaSyDms1aD63mLSJn0Aq9c6v_y0U2be2ogTwI"
                                containerWidth={'100%'}
                                containerHeight={'400px'}
                                token={updationToken}
                            />
                        </Card>
                    </Layout.Section>

                    <Layout.Section oneThird>
                        <Card title="Customer Details">
                            <Card.Section title="NAME">
                                <p>
                                    {orderDetails?.customer?.first_name}{' '}
                                    {orderDetails?.customer?.last_name}
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

                        {orderDetails?.assigned_to && <Card title="Order Assign">
                            <Card.Section title="Order is assigned for delivery">
                                <TextContainer spacing="tight">
                                    <p>Assigned to : {orderDetails?.assigned_to?.name}</p>
                                    <p>Email : {orderDetails?.assigned_to?.email}</p>
                                    <p>Phone : {orderDetails?.assigned_to?.address?.phone}</p>
                                </TextContainer>
                            </Card.Section>
                        </Card>}
                    </Layout.Section>
                </Layout>
            </Page>) :
            (<PageSkeleton />)
            : <h1>Invalid link</h1>}
        {toastMarkup}
    </Frame>)

}

export default CustomerLocationUpdate
