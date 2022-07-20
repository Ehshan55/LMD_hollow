import React, { useState, useCallback, useEffect, useContext } from "react";
import { useRouter, withRouter } from "next/router";

import { Icon, Heading, Page, Card, Button, TextField, Modal, Subheading, ResourceList, Checkbox, ResourceItem, Stack, TextStyle, Badge, Select } from "@shopify/polaris";

import { DragHandleMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import SideNavBar from "../../../components/sideNavBar";
import EmptyResourceList from '../../../components/emptyResourceList';
import EmptyDataState from "../../../components/emptyDataState";
import Map from "../../../components/Map";

import LoaderContext from "../../../contexts/LoaderContext";
import { DataContext } from "../../../contexts/DataContext";

import { createLatLngObject } from "../../../utils/helper";
import extract_idFromArrObj from "../../../utils/extract_idFromArrObj";
import { badgeProgress, badgeStatus } from "../../../utils/customBadge";
import { remove_, uppercase } from "../../../utils/textFormate";

import AdminApiService from '../../../apiservices/adminApiService';
import removeDublicateOrders from "../../../utils/removeDublicateOrders";
const adminApiRequestService = new AdminApiService();

const Route = () => {
    const router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [showLoadingBtn, setShowLoadingBtn] = useState(false);
    const key = "AIzaSyDms1aD63mLSJn0Aq9c6v_y0U2be2ogTwI";//Google maps api key to be included in script tag

    const [zoneId, setZoneId] = useState();
    const [routeId, setRouteId] = useState();
    const [zoneTitle, setZoneTitle] = useState();
    const [routeTitle, setRouteTitle] = useState();

    const [submintBtnTxt, setSubmintBtnTxt] = useState('Create Route');
    const [isNewRoute, setIsNewRoute] = useState(true);

    const [activeOrderModal, setActiveOrderModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [zoneAllOrders, setZoneAllOrders] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedOrders_orders_ids_arr, setaSelectedOrders_orders_ids_arr] = useState([]);

    const [startLoc, setStartLoc] = useState('');
    const [destinationLoc, setDestinationLoc] = useState('');
    const [wayPoints, setWayPoints] = useState([]);

    const [executiveOptionObjArr, setExecutiveOptionObjArr] = useState([]);
    const [selectedExecutive, setSelectedExecutive] = useState('');

    const [backupedOrders, setBackupedOrders] = useState([]);
    const [ordersToAddInModal, setOrdersToAddInModal] = useState([]);



    //* triggers on orderlist rearrangement
    const handleDragEnd = useCallback(({ source, destination }) => {
        setSelectedOrders((oldItems) => {
            const newItems = oldItems.slice(); // Duplicate
            const [temp] = newItems.splice(source?.index, 1);
            newItems.splice(destination?.index, 0, temp);
            extractCoordinates(newItems);
            return newItems;
        });
    }, []);

    //* on Save/update button click
    const saveRoute = () => {
        if (routeTitle) {
            const routeData = {
                title: routeTitle,
                orders: extract_idFromArrObj(selectedOrders),
                assignedAgent: selectedExecutive
            }
            if (isNewRoute) {
                if (selectedOrders?.length) {
                    showLoader(true);
                    adminApiRequestService.postCreateDeliveryMapRoute(routeData, zoneId, (response) => {
                        if (response) {
                            // console.log(response);
                            if (response.data) {
                                setIsNewRoute(false);
                                setSubmintBtnTxt("Update Route");
                                setSelectedOrders(response.data.orders);
                                setBackupedOrders(response.data.orders);
                                constructTostStates(response.msg.toUpperCase(), !response.status);
                            }
                            showLoader(false);
                        }
                    })
                }
                else {
                    activateOrdersModalHandler();
                    constructTostStates("Select order for route creation");
                    showLoader(false);
                }
            }
            else {
                showLoader(true);
                adminApiRequestService.putUpdateDeliveryMapRoute(routeData, routeId, (response) => {
                    if (response?.status) {
                        // console.log(response);
                        setSelectedOrders(response.data.orders);
                        setBackupedOrders(response.data.orders);
                        constructTostStates(response.msg.toUpperCase(), !response.status);
                        showLoader(false);
                    }
                })
            }
        }
        else {
            constructTostStates('Please provide route name');

        }
    }


    //* Opens modal with all orders
    const activateOrdersModalHandler = () => {
        if (zoneId) {

            setShowLoadingBtn(true);
            setModalLoading(true);
            adminApiRequestService.getAllOrdersLeftForMapRoutes(zoneId, (response) => {
                // console.log(response.data);
                if (response) {
                    if (response?.status) {
                        let availableOrders = response?.data;
                        //* FIX FOR dublication of orders for new route creation.
                        if (!isNewRoute) {
                            availableOrders = availableOrders?.concat(selectedOrders);
                        }
                        // * FIX FOR Dublicate orders for old reoutes on order add
                        let processedOrders = removeDublicateOrders(availableOrders);
                        // *FIX FOR if selected order is unchecked and modal is reopened without updating the route then selected order getting lost 
                        if (ordersToAddInModal.length) {
                            processedOrders = processedOrders.concat(ordersToAddInModal);
                        }
                        setZoneAllOrders(processedOrders);
                        setaSelectedOrders_orders_ids_arr(extract_idFromArrObj(selectedOrders));
                        setShowLoadingBtn(false);
                        setActiveOrderModal(true);
                        setModalLoading(false);
                    }
                }
                else {
                    setShowLoadingBtn(false);
                    setModalLoading(false);
                    setActiveOrderModal(true);
                }
            })

        } else {
            constructTostStates('Zone Id not found');
        }
    }


    //* To handle check box selection and uncheck
    const handelCheckBox = useCallback((orderId) => {

        let updated_orders_list = [];
        if (selectedOrders_orders_ids_arr.includes(orderId)) {
            // console.log('remove ', orderId);
            // * checking if saved selected orders are being unchecked and pushing them to a backup variable to push it back in modal order list
            if (extract_idFromArrObj(backupedOrders).includes(orderId)) {
                let removedOrder = selectedOrders.filter((selectedOrder) => selectedOrder._id == orderId)
                setOrdersToAddInModal([...ordersToAddInModal, removedOrder[0]])
            }
            setaSelectedOrders_orders_ids_arr(
                selectedOrders_orders_ids_arr.filter((id) => id !== orderId),
            );
            updated_orders_list = selectedOrders.filter((selectedOrder) => selectedOrder._id !== orderId);
            setSelectedOrders(updated_orders_list);
        } else {
            // console.log('add ', orderId);
            setaSelectedOrders_orders_ids_arr([...selectedOrders_orders_ids_arr, orderId]);
            updated_orders_list = selectedOrders;
            zoneAllOrders.forEach((zoneAllOrder) => {
                if (zoneAllOrder._id == orderId) {
                    setSelectedOrders([...selectedOrders, zoneAllOrder]);
                    updated_orders_list.push(zoneAllOrder);
                }
            })
        }
        extractCoordinates(updated_orders_list);

    },
        [selectedOrders_orders_ids_arr],
    );

    // * To show if delivery agent is assigned or not
    const messageOperation = () => {
        let text_to_show = '';
        if (selectedExecutive) {
            executiveOptionObjArr.map((agent) => {
                if (agent.value == selectedExecutive) {
                    text_to_show = 'This route is assigned to ' + agent.label;
                    return true
                }

            })
            return (text_to_show);
        }
        else {
            return ('No delivery agent assigned for this delivery route.')
        }
    }

    // * For closing the modal
    const handleModalClose = () => {
        // if (selectedOrders.length >= 2) {
        setActiveOrderModal(false);
        // }
        // else {
        //     constructTostStates('Please select alteast two orders')
        // }
    }

    // const handleModalCancel = () => {
    //     setSelectedOrders([]);
    //     setActiveOrderModal(false);

    // }


    //* getting map route orders by zone and route id
    useEffect(() => {
        let zone_id = '';
        let zone_title = '';
        let route_id = '';
        const params = new URLSearchParams(window.location.search);
        if (params.has('zoneId')) {
            zone_id = params.get('zoneId');
            zone_title = params.get('zoneTitle');
            route_id = params.get('routeId');
        }

        setRouteId(route_id);
        setZoneId(zone_id);
        setZoneTitle(zone_title);
        if (zone_id) {
            if (route_id) {
                showLoader(true);
                adminApiRequestService.getDeliveryMapRouteByZoneId(zone_id, route_id, (responseData) => {
                    if (responseData) {
                        console.log(responseData);
                        if (responseData[0]?.orders) {
                            let routeData = responseData[0];
                            if (routeData.owner_user_ref) {
                                let assignedAgent = routeData.owner_user_ref;
                                setSelectedExecutive(assignedAgent._id);
                            }
                            setBackupedOrders(routeData.orders);
                            setSelectedOrders(routeData.orders);
                            extractCoordinates(routeData.orders);
                            setRouteTitle(routeData.title);
                            setIsNewRoute(false);
                            setSubmintBtnTxt("Update Route");
                            showLoader(false);
                        }
                        else {
                            showLoader(false);
                            // console.log("No orders found");
                        }
                    }
                    else {
                        showLoader(false);
                        // console.log("No orders found");
                    }
                })
            } else {
                showLoader(false);
                // console.log("Route id not found");
            }
        } else {
            showLoader(false);
            // console.log("Zone id not found");
        }


        // * Fetching Delivery agents
        let executiveArray = [];
        let executiveObj = {};
        adminApiRequestService.postDeliveryAgentsByZone(zone_id, (responseArray) => {
            if (responseArray) {
                let deliveryExecutives = responseArray;
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

    }, []);


    //----------------------------------------------------------
    //* extracting cooredinats form order.location if not found there then looking in order.shippingaddress
    const extractCoordinates = (ordersArrObj) => {
        // console.log(ordersArrObj)
        let localArr = [];
        let startPin = '';
        let wayPts = [];
        let endPin = '';

        if (ordersArrObj) {
            if (ordersArrObj[0]?.location?.latLng) {
                startPin = ordersArrObj[0]?.location?.latLng;
            }
            else {
                startPin = (`${ordersArrObj[0]?.shipping_address?.latitude},${ordersArrObj[0]?.shipping_address?.longitude}`);
            }
            setStartLoc(startPin);
            if (ordersArrObj.length > 2) {
                for (let i = 1; i < ordersArrObj.length - 1; i++) {
                    if (ordersArrObj?.location?.latLng) {
                        wayPts.push(ordersArrObj?.location?.latLng)
                    }
                    else if (ordersArrObj[i].shipping_address?.latitude != null || ordersArrObj[i].shipping_address?.longitude != null) {
                        localArr.push(`${ordersArrObj[i].shipping_address?.latitude},${ordersArrObj[i].shipping_address?.longitude};`);
                        // removing dublicate cordinates
                        wayPts = [...new Set(localArr)];

                    }
                }
                // console.log("WAYPOINTS ", ordersArrObj.length)
                setWayPoints(wayPts);
            }
            else { setWayPoints([]); }

            if (ordersArrObj[ordersArrObj.length - 1]?.location?.latLng) {
                endPin = ordersArrObj[ordersArrObj.length - 1]?.location?.latLng;
            }
            else {
                endPin = (`${ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.latitude},${ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.longitude}`);
            }
            setDestinationLoc(endPin);

            showLoader(false);
        } else {
            //  console.log("No Orders") 
        }

    }


    return (
        <SideNavBar>
            <Page title={"Route Planner - " + zoneTitle}
                breadcrumbs={[{ content: 'Route Plan', onAction: () => router.back() }]}
            >
                <style jsx>{`
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                      }
                      tbody {
                        display:block;
                        max-height:30vh !important;
                        overflow:auto;
                    }
                      tr {
                        display:table;
                        width:100%;
                        table-layout:fixed;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #DDD;
                        overflow-wrap: break-word;
                    }
                    p{
                        padding: 20vh;
                        text-align: center;
                    }
                    text-center{
                        text-align: center;
                    }
                `}</style>
                <Stack alignment="trailing" >
                    <Stack.Item fill>
                        <Subheading>Route name</Subheading>
                        <TextField
                            type="text"
                            value={routeTitle}
                            onChange={(value) => setRouteTitle(value)}
                            autoComplete="off"
                            placeholder="Route Title"
                        />
                    </Stack.Item>
                    <Stack.Item fill>
                        <Subheading>Assign delivery agent</Subheading>
                        <Select
                            options={executiveOptionObjArr}
                            onChange={(value) => setSelectedExecutive(value)}
                            value={selectedExecutive}
                        />
                    </Stack.Item>
                    <Stack.Item alignment="baseline">
                        <Button primary onClick={saveRoute}>{submintBtnTxt}</Button>
                    </Stack.Item>
                </Stack>
                <div style={{ textAlign: "center" }}><TextStyle variation={selectedExecutive ? "positive" : "warning"}>{messageOperation()} </TextStyle></div>
                <br />

                <Card sectioned primaryFooterAction={{ content: 'Add/Update Orders', onAction: activateOrdersModalHandler, loading: showLoadingBtn }}>

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '5vh' }}>{""}</th>
                                <th># Order</th>
                                <th>Customer Name</th>
                                <th>Delivery Address</th>
                                <th>Delivery Status</th>
                            </tr>
                        </thead>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId='root'>
                                {(provided) => {
                                    return (
                                        <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                            {selectedOrders.map((item, index) => (
                                                <Draggable draggableId={item.id} index={index} key={item.id}>
                                                    {(provided, snapshot) => {
                                                        return (
                                                            <tr
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={
                                                                    snapshot.isDragging
                                                                        ? {
                                                                            background: "lightgray",
                                                                            ...provided.draggableProps.style
                                                                        }
                                                                        : provided.draggableProps.style
                                                                }
                                                            >

                                                                <td style={{ width: '5vh' }}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <Icon
                                                                        source={DragHandleMinor}
                                                                        color="inkLightest"
                                                                    />
                                                                </td>
                                                                <td><Heading>{item.name}</Heading></td>
                                                                <td>{item.shipping_address.first_name}{' '}{item.shipping_address.last_name}</td>
                                                                <td>{item.shipping_address.address1}{item.shipping_address.address2} </td>
                                                                <td><Badge status={badgeStatus(item?.delivery_status)} progress={badgeProgress(item?.delivery_status)}> {remove_(item?.delivery_status, true)} </Badge> </td>

                                                            </tr>
                                                        );
                                                    }}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    );
                                }}
                            </Droppable>
                        </DragDropContext>
                    </table>

                    {!selectedOrders.length && <EmptyDataState title="No orders selected for route" message="Select orders for route creation" />}
                </Card>

                {/* ___________________________MAP Section____________________________________ */}
                <Card>
                    {(selectedOrders.length > 1) ? <Map
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}`}
                        // googleMapURL="https://maps.googleapis.com/maps/api/js?key="
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        center={createLatLngObject(startLoc)}
                        zoom={9}
                        startLoc={startLoc}
                        wayPoints={wayPoints}
                        destinationLoc={destinationLoc}
                        orders={selectedOrders}
                    /> : <p style={{ padding: '20vh', textAlign: 'center' }}>Loading Map... </p>}

                </Card>


                <Modal
                    open={activeOrderModal}
                    title="Select alteast 2 orders to make a delivery route"
                    onClose={handleModalClose}
                    // onScrolledToBottom={handleScrollBottom}
                    primaryAction={{
                        content: 'Done',
                        onAction: handleModalClose,
                    }}
                // secondaryActions={[
                //     {
                //         content: 'Cancel',
                //         onAction: handleModalCancel,
                //     }
                // ]}
                >
                    <Card sectioned>
                        <ResourceList
                            loading={modalLoading}
                            emptyState={zoneAllOrders.length == 0 && <EmptyResourceList heading="No orders found" content="There are no orders associated to this zone yet or there are no orders available for route creation" />}
                            resourceName={{ singular: 'warehouse', plural: 'warehouses' }}
                            items={zoneAllOrders?.map((zoneOrder, index) => {
                                return {
                                    id: zoneOrder._id,
                                    name: zoneOrder.name + ' ' + zoneOrder.shipping_address?.first_name + ' ' + zoneOrder.shipping_address?.last_name,
                                    delivery_address: zoneOrder.shipping_address?.address1 + zoneOrder.shipping_address?.address2,
                                    checkbox: (
                                        <Checkbox
                                            checked={selectedOrders_orders_ids_arr.includes(zoneOrder._id)}
                                            onChange={() => handelCheckBox(zoneOrder._id)}
                                        />
                                    ),
                                    badge: (
                                        <Badge status={badgeStatus(zoneAllOrders?.fulfillment_status || 'Unfulfilled')} progress={badgeProgress(zoneAllOrders?.fulfillment_status || 'Unfulfilled')}>
                                            {uppercase(zoneAllOrders?.fulfillment_status || 'Unfulfilled')}
                                        </Badge>
                                    ),
                                };
                            })}
                            renderItem={(item) => {
                                const { id, name, delivery_address, checkbox, badge } = item;

                                return (
                                    <ResourceItem
                                        id={id}
                                        accessibilityLabel={`View details for ${id}`}
                                    >
                                        <Stack>
                                            {checkbox}
                                            <h3>
                                                <TextStyle variation="strong">{name}</TextStyle>
                                            </h3>
                                            <div>{delivery_address}</div>
                                            {badge}
                                        </Stack>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </Card>
                </Modal>

            </Page>
        </SideNavBar >
    );
}


export default withRouter(Route)
