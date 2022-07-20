

import { Badge, Button, Caption, Card, Form, FormLayout, Frame, Heading, Layout, Modal, Page, ResourceItem, ResourceList, Select, Stack, Subheading, TextContainer, TextField, TextStyle, Thumbnail, TopBar } from '@shopify/polaris'
import React, { useCallback, useState, useEffect, Fragment } from 'react'
import { useRouter } from "next/router"
import PageSkeleton from "../../components/skeletons/pageSkeleton"
import axios from 'axios';
import CookiesJs from 'js-cookie';
import { enviornment } from '../../utils/envConfig';
import { uppercase, remove_ } from '../../utils/textFormate';
import { badgeStatus, badgeProgress } from '../../utils/customBadge';
import { dateFormate } from '../../utils/dateFormate';
import validate_form from '../../utils/validateForm';
import ToastUp from '../../components/toast';
import { RedirectPage } from '../../contexts/UtilsContext';

const OrderDetails = ({ store }) => {
    const router = useRouter();

    const [ModalActive, setModalActive] = useState(true);
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [storeUrl, setstoreUrl] = useState(store);

    const [orderDetails, setOrderDetails] = useState();
    const [Title, setTitle] = useState();
    const [date, setDate] = useState();
    const [status, setStatus] = useState({
        financial: '',
        delivery: '',
        fulfillment: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const [itemsArray, setItemsArray] = useState([]);

    const [isOrderIdEmpty, setIsOrderIdEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);

    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastErrorMessage, setToastErrorMessage] = useState(false);


    // * getting order details on model form submittion
    const getOrderDeliveryTraking = () => {
        if (!email) {
            setIsEmailEmpty(true);
        } else if (!email) {
            setIsEmailEmpty(true);
        }
        else {
            setIsLoading(true);
            let baseUrl = enviornment.API_CLIENT.URL;
            let body = { email: email, order_no: orderId }
            try {
                axios.post(`${baseUrl}/api/v2/customer/track-details/${storeUrl}`, body).then(response => {
                    // console.log(response);
                    if (response.data.status) {
                        let orderDetails = response.data.data.order_obj;
                        setOrderDetails(orderDetails);
                        setModalActive(false);
                        setTitle(orderDetails.name);
                        setDate(orderDetails.created_at);
                        setStatus({
                            financial: orderDetails.financial_status,
                            delivery: orderDetails.delivery_status,
                            fulfillment: orderDetails.fulfillment_status,
                        });
                        setItems(orderDetails);
                    }
                    else {
                        constructTostStates(response.data.msg, response.data.status)
                    }
                    setIsLoading(false);
                })
            } catch (err) {
                setIsLoading(false);
                // console.log(err);
            }
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

    const modal = (<Modal open={ModalActive} onClose={() => router.push('/')} title="Track your order delivery status!" sectioned={true}>

        <Form onSubmit={getOrderDeliveryTraking}>
            <div style={{ paddingInline: '5vh' }}>
                <FormLayout>
                    <TextField label="Email" value={email.toLocaleLowerCase()} onChange={(value) => { setEmail(value) }} placeholder="ipsum@emai.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}" type="email" autoComplete="email" error={isEmailEmpty && 'Reqired'} onBlur={() => setIsEmailEmpty(validate_form(email))} onFocus={() => setIsEmailEmpty(false)} />
                    <TextField label="Order Id" value={orderId} onChange={(value) => { setOrderId(value) }} placeholder="#2323" autoComplete="off" error={isOrderIdEmpty && 'Reqired'} onBlur={() => setIsOrderIdEmpty(validate_form(orderId))} onFocus={() => setIsOrderIdEmpty(false)} />
                </FormLayout>

                <div style={{ paddingBlock: 20, textAlign: 'end' }}>
                    <Button loading={isLoading} primary submit>Track</Button>
                </div>
            </div>
        </Form>

    </Modal>)

    const toastMarkup = toastActive ? (
        <ToastUp text={toastMessage} toastErrorMessage={toastErrorMessage} toggleToastActive={() => setToastActive(false)} duration={5000} />
    ) : null;

    return (<Frame>
        <TopBar />
        {modal}
        {!ModalActive ?
            (<Page
                title={('Order Id : ' + Title) || 'Order Id'}
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

                        <Card title="Delivery Timeline">
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
        }
        {toastMarkup}
    </Frame>)

}

OrderDetails.getInitialProps = async (ctx) => {

    let queryHandle = "";
    if (ctx.query) {
        let queryParams = ctx.query.slug;
        queryHandle = queryParams;
    }
    return new Promise((resolve, reject) => {
        try {
            if (queryHandle) {
                resolve({ store: queryHandle })
            } else {
                console.log('QueryHandle not found');
                RedirectPage(ctx, "/");
            }

        } catch (error) {
            console.log("Error : ", error);
            RedirectPage(ctx, "/");
        }
    });
};

export default OrderDetails
