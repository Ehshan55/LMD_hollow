import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal, Subheading } from "@shopify/polaris";

import { Badge, Button, Card, IndexTable, Page, PageActions, Pagination, Stack, TextStyle, Checkbox, Banner, List, Link, Select, TextField, Tabs } from '@shopify/polaris';

import EmptyDataState from '../emptyDataState';
import TopBanner from '../topBanner';

import { badgeProgress, badgeStatus } from '../../utils/customBadge';
import { dateFormate } from '../../utils/dateFormate';
import { formatStatusTxt, remove_, uppercase } from '../../utils/textFormate';


const AllOrdersPageView = (props) => {

    const searchTypeOptions = [
        { label: 'Order Id', value: 'by_order_id' },
        { label: 'Name', value: 'by_customer_name' },
    ];


    const [selectedSearchOption, setSelectedSearchOption] = useState();
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


    //* on search type selection change
    const handleSelectChange = useCallback((value) => {
        setSelectedSearchOption(value);
        searchType = value;
        setSearchText('');
        setOrders(ordersBackup);
        setAppliedfilter(false);
        setSelectedRange('');
    }, []);


    return (
        <Page >
            {/* {warehouseZoneBanner}{scriptBanner} <br />
            <TopBanner orderCount={ordreAnalytics} handelFilterByStatus={setOrderType} />
            {bulkOrderAssignResponseBannerMsg} */}
            <br />
            <Card>
                <Card.Section>
                    <Stack>
                        <Stack.Item>
                            <TextField
                                connectedLeft={<Select
                                    placeholder="Search By"
                                    options={searchTypeOptions}
                                    onChange={handleSelectChange}
                                    value={selectedSearchOption}
                                />}
                                placeholder={(selectedSearchOption == 'by_customer_name') ? "Customer Name" : "1234"}
                                prefix={(selectedSearchOption != 'by_customer_name') && " #"}
                                value={searchText}
                                onChange={handleFilter}
                                type={(selectedSearchOption == 'by_customer_name') ? "text" : "number"}
                                autoComplete="off"
                                clearButton
                                onClearButtonClick={handleClearButton}
                                connectedRight={<Button loading={searching} disabled={!searchText ? true : false} onClick={handleSearch}>Search</Button>}
                            />
                        </Stack.Item>
                        <Stack.Item fill>
                        </Stack.Item>
                        {/* <Stack.Item >
                <Button primary onClick={handelAssignOrders} disabled={checkedOrders?.length ? false : true}>Quick Assign</Button>
              </Stack.Item> */}
                    </Stack>
                </Card.Section>
                {!isLoading ?
                    <AssignedOrderTable order_list={orders} onHandleOrderDetails={handelOrderDetails} loader_status={searching} appliedfilter={appliedfilter} />
                    :
                    <EmptyDataState title="Loading" message="Fetching orders" />
                }
                <Card.Section>
                    {!appliedfilter ?
                        <Stack alignment="center">
                            <Stack.Item fill>
                                <p>{`Showing ${orders?.length} of ${totalOrders || 0} orders`}</p>
                            </Stack.Item>
                            <Stack.Item >
                                <Select disabled={orders?.length == 0} labelInline label="View" options={RangeOptions} onChange={handleRangeSelectChange} value={selectedRange} />
                            </Stack.Item>

                            <Stack.Item >
                                <Select labelInline label="Page" options={PageOptions} onChange={handlePageJumpSelectChange} value={parseInt(selectedPage)} onFocus={makeJumpPageOptions} />
                            </Stack.Item>

                            <Stack.Item >
                                <Pagination
                                    label={'Page : ' + pageNo + ' of ' + (totalPages || 1)}
                                    hasPrevious
                                    onPrevious={() => {
                                        { pageNo != 1 && setPageNo(parseInt(pageNo) - 1) }
                                    }}
                                    hasNext
                                    onNext={() => {
                                        { totalPages != pageNo && setPageNo(parseInt(pageNo) + 1) }
                                    }}
                                />
                            </Stack.Item>
                        </Stack> :
                        orders?.length == 0 && <Stack alignment="center">
                            <Stack.Item fill>
                                <p>{`Showing ${orders?.length} of ${orders?.length} orders`}</p>
                            </Stack.Item>
                        </Stack>
                    }
                </Card.Section>
            </Card>
            <div style={{ paddingTop: 15, textAlign: 'end' }}>
                <Link onClick={handelOrderDetailsTracking}> Customer's Portal Order Tracking </Link>
            </div>
        </Page>
    )
}

export default AllOrdersPageView;
