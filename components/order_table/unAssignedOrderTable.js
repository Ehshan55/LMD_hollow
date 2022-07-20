import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal, Subheading } from "@shopify/polaris";

import { Badge, Button, Card, IndexTable, Page, PageActions, Pagination, Stack, TextStyle, Checkbox, Banner, List, Link, Select, TextField, Tabs } from '@shopify/polaris';

import EmptyDataState from '../emptyDataState';
import TopBanner from '../topBanner';

import { badgeProgress, badgeStatus } from '../../utils/customBadge';
import { dateFormate } from '../../utils/dateFormate';
import { formatStatusTxt, remove_, uppercase } from '../../utils/textFormate';


const UnAssignedOrderTable = (props) => {

    const [orders, setOrders] = useState(props.order_list || []);
    const [loaderStaus, setLoaderStatus] = useState(props.loader_status || false);
    const [appliedfilter, setAppliedfilter] = useState(props.loader_status || false);
    const resourceName = { singular: 'order', plural: 'orders', };

    let handelOrderDetails = (order_id) => {
        if (order_id && props.onHandleOrderDetails) {
            props.onHandleOrderDetails(order_id);
        }
    }


    useEffect(() => {
        setOrders(props.order_list || []);
        setLoaderStatus(props.loader_status);
        setAppliedfilter(props.loader_status);
    }, [props])

    const UncyncedRowMarkup = orders.map((order, index) => (
        <IndexTable.Row id={order._id} key={index} position={index} status={order.is_assigned ? 'success' : ''}>
            <IndexTable.Cell><TextStyle variation="strong">{order?.name}</TextStyle> </IndexTable.Cell>
            <IndexTable.Cell>{order?.shipping_address?.name}</IndexTable.Cell>
            <IndexTable.Cell>{dateFormate(order?.createdAt)}</IndexTable.Cell>

            <IndexTable.Cell>
                <Badge status={badgeStatus(order?.delivery_status)} progress={badgeProgress(order?.delivery_status)}> {remove_(order?.delivery_status, true)} </Badge>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Badge status={badgeStatus(order?.fulfillment_status || 'Unfulfilled')} progress={badgeProgress(order?.fulfillment_status || 'Unfulfilled')}>
                    {uppercase(order?.fulfillment_status || 'Unfulfilled')}
                </Badge>
            </IndexTable.Cell>

            <IndexTable.Cell>{(order?.tags)}</IndexTable.Cell>

            <IndexTable.Cell>
                <Button plane onClick={() => { handelOrderDetails(order?._id); }}> View </Button>
            </IndexTable.Cell>

        </IndexTable.Row>
    ));



    return (
        <IndexTable
            resourceName={resourceName}
            loading={loaderStaus}
            selectable={false}
            itemCount={orders?.length}
            emptyState={appliedfilter ? <EmptyDataState title="No Match Found" message="Clear the search field to bring back all orders" /> : <EmptyDataState title="No Orders Yet" message="Upcoming orders with mentioned area pin code in the warehouse zones will auto sync and list here." />}
            headings={[
                // { title: '#' }, 
                { title: 'Order No.' },
                { title: 'Customer Name' },
                { title: 'Order Date' },
                { title: 'Delivery Status' },
                { title: 'Order Status' },
                { title: 'Tags' },
                { title: 'Action' },
            ]}
        >
            {UncyncedRowMarkup}

        </IndexTable>
    )
}

export default UnAssignedOrderTable;
