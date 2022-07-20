import React, { useState, useCallback, useEffect, useContext } from "react";
import { useRouter, withRouter } from "next/router";

import { Icon, Heading, Page, Card, Button, TextField, Modal, Subheading, ResourceList, Checkbox, ResourceItem, Stack, TextStyle, Badge, Select, Tag } from "@shopify/polaris";

import { DragHandleMinor, DeleteMajor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import SideNavBar from "../../../../components/sideNavBar";
import EmptyResourceList from '../../../../components/emptyResourceList';
import EmptyDataState from "../../../../components/emptyDataState";
import Map from "../../../../components/Map";

import LoaderContext from "../../../../contexts/LoaderContext";
import { DataContext } from "../../../../contexts/DataContext";

import { createLatLngObject } from "../../../../utils/helper";
import extract_idFromArrObj from "../../../../utils/extract_idFromArrObj";
import { badgeProgress, badgeStatus } from "../../../../utils/customBadge";
import { remove_, uppercase } from "../../../../utils/textFormate";

import AdminApiService from '../../../../apiservices/adminApiService';
const adminApiRequestService = new AdminApiService();

const Route = () => {
    const router = useRouter();
    const { showLoader } = useContext(LoaderContext);
    const { constructTostStates } = useContext(DataContext);

    const [showLoadingBtn, setShowLoadingBtn] = useState(false);
    const key = "AIzaSyDms1aD63mLSJn0Aq9c6v_y0U2be2ogTwI";//Google maps api key to be included in script tag

    const [allUnallocatedOrders, setAllUnallocatedOrders] = useState([]);
    const [searchTriggred, setSearchTriggred] = useState(false);
    const [routeTitle, setRouteTitle] = useState();

    const [activeOrderModal, setActiveOrderModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [orderListFormSearch, setOrderListSearch] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedOrders_orders_ids_arr, setaSelectedOrders_orders_ids_arr] = useState([]);

    const [startLoc, setStartLoc] = useState('');
    const [destinationLoc, setDestinationLoc] = useState('');
    const [wayPoints, setWayPoints] = useState([]);

    const [executiveOptionObjArr, setExecutiveOptionObjArr] = useState([]);
    const [selectedExecutive, setSelectedExecutive] = useState('');

    const [backupedOrders, setBackupedOrders] = useState([]);
    const [ordersToAddInModal, setOrdersToAddInModal] = useState([]);

    const [selectedSearchOption, setSelectedSearchOption] = useState("order_name");

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [locationRequestLoading, setLocationRequestLoading] = useState(false);

    //* search select change
    const handleSelectChange = (value) => {
        setSelectedSearchOption(value);
        setSearchTriggred(false);
        setOrderListSearch(allUnallocatedOrders);
    };


    //* search select text field change
    const handleFilter = useCallback((value) => {
        setSearchText(value);
    }, []);

    //* search select text field clear button
    const handleClearButton = useCallback((value) => {
        setSearchText('');
        setSearchText("");
        setOrderListSearch(allUnallocatedOrders);
        setSearchTriggred(false);
    }, []);

    //* search select button function
    const handleSearch = () => {
        // showLoader(true);
        setSearching(true);
        adminApiRequestService.getAdminOrderSearch(selectedSearchOption, searchText, "unallocated", '', (responseArray) => {
            if (responseArray) {
                setOrderListSearch(responseArray);
            }
            setSearchTriggred(true);
            setSearching(false);
        });
    }


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
            if (selectedOrders?.length) {
                const routeData = {
                    title: routeTitle,
                    orders: extract_idFromArrObj(selectedOrders),
                    assignedAgent: selectedExecutive
                }

                if (selectedExecutive) {
                    showLoader(true);
                    adminApiRequestService.postCreateDeliveryQuickMapRoute(routeData, (response) => {
                        if (response.status) {
                            // console.log("API Repsonse ", response);
                            window.history.back();
                        } else {
                            constructTostStates("Some error occured! Please try again.");
                        }
                        showLoader(false);
                    })
                } else {
                    constructTostStates('Please assign a delivery agent');
                }
            } else {
                activateOrdersModalHandler();
                constructTostStates("Select orders to create routes");
                showLoader(false);
            }
        } else {
            constructTostStates('Please provide route name');
        }
    }


    //* Opens modal with all orders
    const activateOrdersModalHandler = () => {

        setModalLoading(true);
        setActiveOrderModal(true);

        setSearching(true);
        adminApiRequestService.getAdminOrderSearch('', '', "unallocated", '', (responseArray) => {
            if (responseArray) {
                setOrderListSearch(responseArray);
                setAllUnallocatedOrders(responseArray);
                let _ids = [];
                _ids = extract_idFromArrObj(selectedOrders);
                setaSelectedOrders_orders_ids_arr(_ids);
            }
            setModalLoading(false);
            setSearching(false);
        });
        setSearchText('');
        setSearchText("");
        setSearchTriggred(false);
    }


    //* To handle check box selection and uncheck
    const handelCheckBox = (orderId) => {
        // console.log("orider id", selectedOrders_orders_ids_arr.filter((id) => id !== orderId));
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
            orderListFormSearch.forEach((Order) => {
                if (Order._id == orderId) {
                    updated_orders_list.push(Order);
                    setSelectedOrders(updated_orders_list);
                }
            })
        }
        extractCoordinates(updated_orders_list);

    }

    // * For selecting all orders at once. checking if the order already exisits in selectedOrders state
    const handleSelectAll = () => {
        let selectedOrdersLocal = [];
        orderListFormSearch.forEach((listOrder) => {
            if (!extract_idFromArrObj(selectedOrders).includes(listOrder._id)) {
                selectedOrdersLocal.push(listOrder);
            }
        })
        if (selectedOrdersLocal.length) {
            let ordersToRouteLocal = selectedOrders.concat(selectedOrdersLocal);
            let ordersWithLocation = ordersToRouteLocal.filter((order) => order.location || (order.shipping_address?.latitude && order.shipping_address?.longitude) || (order.billing_address?.latitude && order.billing_address?.longitude));
            // console.log(ordersWithLocation);
            // ordersWithLocation.forEach((order) => { console.log(order.name) })
            extractCoordinates(ordersWithLocation);
            setSelectedOrders(ordersWithLocation);
            setaSelectedOrders_orders_ids_arr(extract_idFromArrObj(ordersWithLocation));
        }
    }

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
        setActiveOrderModal(false);
    }

    // * For removal of order by index ffrom table
    const orderRemoveByIndexHandler = (index) => {
        let selectedOrderslocal = selectedOrders;
        selectedOrderslocal.splice(index, 1);

        setSelectedOrders(selectedOrderslocal);
        setaSelectedOrders_orders_ids_arr(extract_idFromArrObj(selectedOrderslocal));
        extractCoordinates(selectedOrderslocal);
    }

    //* getting map route orders by zone and route id
    useEffect(() => {

        showLoader(false);

        // * Fetching Delivery agents
        let executiveArray = [];
        let executiveObj = {};
        adminApiRequestService.getAllDeliveryAgentsList((responseArray) => {
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
                setStartLoc(startPin);
            }
            else if (ordersArrObj[0]?.shipping_address?.latitude && ordersArrObj[0]?.shipping_address?.longitude) {
                startPin = (`${ordersArrObj[0]?.shipping_address?.latitude},${ordersArrObj[0]?.shipping_address?.longitude}`);
                setStartLoc(startPin);
            }
            else if (!startPin) {
                constructTostStates('Starting location not found. Pleae select an order having map location', true, 3000);
                setSelectedOrders([]);
                setaSelectedOrders_orders_ids_arr([]);

            }

            if (ordersArrObj.length > 2) {
                for (let i = 1; i < ordersArrObj.length - 1; i++) {
                    if (ordersArrObj?.location?.latLng) {
                        wayPts.push(ordersArrObj?.location?.latLng);
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
                setDestinationLoc(endPin);
            }
            else if (ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.latitude && ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.longitude) {
                endPin = (`${ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.latitude},${ordersArrObj[ordersArrObj.length - 1]?.shipping_address?.longitude}`);
                setDestinationLoc(endPin);
            }
            else {
                // constructTostStates('Ending location not found', true, 2000)
            }


            showLoader(false);
        } else {
            //  console.log("No Orders") 
        }

    }

    // *Requesting for deliveruy location update 
    const locationUpdateRequest = (order_id) => {
        setLocationRequestLoading(true);
        adminApiRequestService.postRequestLocationUpdate(order_id, (response) => {
            if (response) {
                // console.log(response);
                constructTostStates(response.msg, !response.status);
                setLocationRequestLoading(false);
            }
        });
    }


    return (
        <SideNavBar>
            <Page title="Route Planner "
                breadcrumbs={[{ content: 'Route Plan', onAction: () => router.back() }]}
                fullWidth>
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
                    .stick-to-top{
                        top: 0;
                        position: sticky;
                        z-index: 100;
                        background: white;
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
                        <Button primary onClick={saveRoute}>Create Route</Button>
                    </Stack.Item>
                </Stack>
                <div style={{ textAlign: "center" }}><TextStyle variation={selectedExecutive ? "positive" : "warning"}>{messageOperation()} </TextStyle></div>
                <br />

                <Card sectioned primaryFooterAction={{ content: 'Add Orders', onAction: activateOrdersModalHandler, loading: showLoadingBtn }}>

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>{""}</th>
                                <th style={{ width: '9%' }}># Marker</th>
                                <th style={{ width: '15%' }}># Order</th>
                                <th style={{ width: '20%' }}>Customer Name</th>
                                <th style={{ minWidth: '30%' }}>Delivery Address</th>
                                <th style={{ width: '15%' }}>Delivery Status</th>
                                <th style={{ width: '7%' }}>Remove</th>
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

                                                                <td style={{ width: '4%' }}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <Icon
                                                                        source={DragHandleMinor}
                                                                        color="inkLightest"
                                                                    />
                                                                </td>
                                                                <td style={{ width: '9%' }}> <b>{index + 1}</b> </td>
                                                                <td style={{ width: '15%' }}><Heading>{item.name}</Heading></td>
                                                                <td style={{ width: '20%' }}>{item.shipping_address?.first_name}{' '}{item.shipping_address?.last_name}</td>
                                                                <td style={{ minWidth: '30%' }}>{item.shipping_address?.address1}{item.shipping_address?.address2} </td>
                                                                <td style={{ width: '15%' }}><Badge status={badgeStatus(item?.delivery_status)} progress={badgeProgress(item?.delivery_status)}> {remove_(item?.delivery_status, true)} </Badge> </td>
                                                                <td style={{ width: '7%' }}><Button size="small" icon={DeleteMajor} plain onClick={() => orderRemoveByIndexHandler(index)} /></td>


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
                    large
                    open={activeOrderModal}
                    title={allUnallocatedOrders.length ? ("Selected  " + selectedOrders.length + " of  " + allUnallocatedOrders.length + " total orders") : "Fetching unallocated orders..."}
                    onClose={handleModalClose}
                    // onScrolledToBottom={handleScrollBottom}
                    primaryAction={{
                        content: 'Done',
                        onAction: handleModalClose,
                    }}
                    secondaryActions={[
                        {
                            content: 'Select All',
                            onAction: handleSelectAll,
                        },
                    ]}
                >
                    <Card sectioned>
                        <div className="stick-to-top">
                            <Stack>
                                <Stack.Item fill>
                                    <TextField
                                        connectedLeft={
                                            <Select
                                                placeholder="Search By"
                                                options={[
                                                    { label: 'Order Name', value: 'order_name' },
                                                    { label: 'Order Id', value: 'order_id' },
                                                    { label: 'Zone Name', value: 'zone_name' },
                                                    { label: 'Order Tags', value: 'order_tags' },
                                                ]}
                                                onChange={handleSelectChange}
                                                value={selectedSearchOption}
                                            />
                                        }
                                        placeholder={"Search Values"}
                                        value={searchText}
                                        onChange={handleFilter}
                                        autoComplete="off"
                                        clearButton
                                        onClearButtonClick={handleClearButton}
                                        connectedRight={<Button loading={searching} disabled={!searchText ? true : false} onClick={handleSearch}>Search</Button>}
                                    />
                                </Stack.Item>
                            </Stack>
                        </div>
                        {searchTriggred && <div style={{ paddingBlock: 10 }}><Tag onRemove={handleClearButton}>Search result : Found {orderListFormSearch.length} orders by {remove_(selectedSearchOption, '')} '{searchText}' </Tag></div>}
                        <ResourceList
                            loading={modalLoading}
                            emptyState={orderListFormSearch.length == 0 && <EmptyResourceList heading="No orders found" content="There are no orders associated to this zone yet or there are no orders available for route creation" />}
                            resourceName={{ singular: 'warehouse', plural: 'warehouses' }}
                            items={orderListFormSearch?.map((zoneOrder, index) => {
                                return {
                                    id: zoneOrder?._id,
                                    name: zoneOrder?.name + ' ' + zoneOrder?.shipping_address?.first_name + ' ' + zoneOrder?.shipping_address?.last_name,
                                    delivery_address: zoneOrder?.shipping_address?.address1 + zoneOrder?.shipping_address?.address2,
                                    checkbox: (
                                        <Checkbox
                                            disabled={!zoneOrder.location && !zoneOrder?.shipping_address?.latitude}
                                            checked={selectedOrders_orders_ids_arr.includes(zoneOrder?._id)}
                                            onChange={() => handelCheckBox(zoneOrder?._id)}
                                        />
                                    ),
                                    e_badge: (!zoneOrder.location && !zoneOrder?.shipping_address?.latitude &&
                                        <Button size="slim" plain onClick={() => locationUpdateRequest(zoneOrder._id)}>
                                            <span style={zoneOrder.location_request_token ? { color: 'green' } : { color: 'unset' }}>{zoneOrder.location_request_token ? "Location Requested" : 'Request location'}</span>
                                        </Button>
                                    ),
                                    f_badge: (
                                        <Badge status={badgeStatus(zoneOrder?.fulfillment_status || 'Unfulfilled')} progress={badgeProgress(zoneOrder?.fulfillment_status || 'Unfulfilled')}>
                                            {uppercase(zoneOrder?.fulfillment_status || 'Unfulfilled')}
                                        </Badge>
                                    ),
                                    zt_badge: (zoneOrder?.tags || zoneOrder?.zone_id?.title) && (
                                        <Badge>
                                            {zoneOrder?.tags || zoneOrder?.zone_id?.title}
                                        </Badge>
                                    ),
                                };
                            })}
                            renderItem={(item) => {
                                const { id, name, delivery_address, checkbox, f_badge, zt_badge, e_badge } = item;

                                return (
                                    <ResourceItem
                                        id={id}
                                        accessibilityLabel={`View details for ${id}`}>
                                        <Stack distribution="leading" wrap={true}>
                                            {checkbox}
                                            <Stack.Item fill>
                                                <TextStyle variation="strong">{name}</TextStyle>
                                                <div style={{ width: 450 }}>{delivery_address}</div>
                                            </Stack.Item>
                                            <Stack.Item distribution="tailing">
                                                <div style={{ textAlign: 'end' }}>{e_badge} {f_badge}
                                                    <div style={{ padding: 3 }} />
                                                    {zt_badge}</div>
                                            </Stack.Item>
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
