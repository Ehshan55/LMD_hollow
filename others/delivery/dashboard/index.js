import { Badge, Button, Card, IndexTable, Link, Page, Pagination, Select, Stack, TextField, TextStyle } from '@shopify/polaris';

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';

import CookiesJs from 'js-cookie';

import EmptyDataState from '../../../components/emptyDataState';
import TopBanner from '../../../components/topBanner';

import { uppercase, remove_ } from '../../../utils/textFormate';
import { badgeStatus, badgeProgress } from '../../../utils/customBadge';
import { dateFormate } from '../../../utils/dateFormate';

import { validateLogin } from '../../../contexts/AuthContext';

import ApiService from '../../../apiservices/deliveryApiService';
import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';
import SideNavBarDelivery from '../../../components/sideNavBarDelivery';
const deliveryApiRequestService = new ApiService();

const Orders = () => {

  const router = useRouter();

  const { showLoader } = useContext(LoaderContext);
  const { ordreAnalytics, storeName, setTopLoading } = useContext(DataContext);

  const [pageNo, setPageNo] = useState(1);
  const [allPages, setAllPages] = useState();
  const [size, setSize] = useState();
  const [orderType, setOrderType] = useState('all');
  const [totalPages, setTotalPages] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [orders, setOrders] = useState([]);
  const ordersBackup = [];

  const [refetchData, setRefetchData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [buldOrdersAssignMsg, setBuldOrdersAssignMsg] = useState([{}]);
  const [bannerActive, setBannerActive] = useState(false);

  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRange, setSelectedRange] = useState('');

  const [pageOptions, setPageOptions] = useState([]);

  const [selectedSearchOption, setSelectedSearchOption] = useState();

  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [appliedfilter, setAppliedfilter] = useState(false);

  const resourceName = { singular: 'order', plural: 'orders', };

  const RangeOptions = [
    { label: ' ', value: '' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];

  const searchTypeOptions = [
    { label: 'Order Id', value: 'by_order_id' },
    { label: 'Name', value: 'by_customer_name' },
  ];

  let searchValue = '';
  const searchType = 'by_order_id';

  // TODO: Could be use inplace of pageRefresh state
  // const toggelForDataRefetch = useCallback(() => {
  //   setRefetchData((prevState) => { return !prevState })
  // }, [])


  //* To open multipal selected orders on one button click in multipal tabs (May use is future)
  // const handleViewDetails = (ids) => {
  //   // console.log(ids);
  //   ids.forEach((id) => {
  //     redirectPage(id);
  //   });
  // };
  // const redirectPage = (id) => {
  //   window.open(`/manager/dashboard/orderDetails/`, '_blank');
  // };


  //* To open order details page
  const handelOrderDetails = (orderId) => {
    // router.push({
    //   pathname: '/order_details',
    //   query: { orderId, userId },
    // });
    // console.log(orderId);
    window.open(`/delivery/order-details/${orderId}`, '_blank');
  };

  //* To add jump to specific page no feature
  const handlePageJumpSelectChange = useCallback((value) => {
    if (value) {
      setPageNo(value);
      setSelectedPage(value);
    }
  }, []);

  //* on order range select
  const handleRangeSelectChange = useCallback((value) => {
    if (value) {
      setPageNo(1);
      setSize(value);
      setSelectedRange(value);
    }
    if (!selectedRange) {
      setSelectedPage(1);
    }
  }, []);

  //* making page jump obtions dynamically
  const makeJumpPageOptions = () => {
    // console.log(totalPages)
    let jumpPageObjArr = [{ label: '', value: '' }]
    allPages?.map((pageUrl, index) => {
      let page_no = (index + 1);
      jumpPageObjArr.push({ label: page_no, value: page_no })
      // console.log(jumpPageObjArr)
    })
    setPageOptions(jumpPageObjArr);
  }

  //* To open order details tracking for customer
  const handelOrderDetailsTracking = () => {
    let storeUrl = CookiesJs.get('storeName') || storeName;
    window.open(`/order-traking/${storeUrl}`, '_blank');
  };


  //* on search type selection change
  const handleSelectChange = useCallback((value) => {
    setSelectedSearchOption(value);
    searchType = value;
    setSearchText('');
    setOrders(ordersBackup);
    setAppliedfilter(false);
    // setSize('');
    setSelectedRange('');
    // setPageNo(1);
    // setSelectedPage(1);
    // toggelForDataRefetch();

  }, []);


  //* on search input change
  const handleFilter = useCallback((value) => {
    if (!value) {
      setOrders(ordersBackup);
    }
    setSearchText(value);
    searchValue = value;
  }, [])


  //* search api call
  const handleSearch = useCallback(() => {
    setSearching(true);
    deliveryApiRequestService.getDeliveryDashboardOrders('', '', '', searchValue, searchType, (responseData) => {
      if (responseData) {
        // console.log(responseData)
        setOrders(responseData.api_data.orders);
        setAppliedfilter(true);
        setSearching(false);
      }
    })
  }, [])


  //* on search button clear press
  const handleClearButton = useCallback(() => {
    setOrders(ordersBackup);
    setSearchText('');
    setAppliedfilter((prevstate) => !prevstate);
  }, [])


  //* using another useEffect for just order refreshing while pagination and filtering
  useEffect(() => {
    showLoader(true);
    setTopLoading(true);
    if (ordreAnalytics) {
      setIsLoading(true);
      deliveryApiRequestService.getDeliveryDashboardOrders(pageNo, size, orderType, '', '', (responseData) => {
        if (responseData) {
          let adminsOrder = responseData.api_data;
          // console.log(adminsOrder.orders);
          setOrders(adminsOrder.orders);
          ordersBackup = adminsOrder.orders;
          setTotalOrders(adminsOrder.total_orders);
          setTotalPages(adminsOrder.total_pages);
          setAllPages(responseData.numUrls);
          setIsLoading(false);
          showLoader(false);
          setTopLoading(false);

        } else {
          console.log('Undefined Response from getDeliveryDashboardOrders ',);
          showLoader(false);
          setTopLoading(false);
        }
      });
    }

  }, [refetchData, pageNo, orderType, size])


  const rowMarkup = orders?.map((order, index) => (
    <IndexTable.Row id={order._id} key={index} position={index}>

      <IndexTable.Cell><TextStyle variation="strong">{order.order_ref.name}</TextStyle> </IndexTable.Cell>
      <IndexTable.Cell>{order.order_ref.shipping_address?.name}</IndexTable.Cell>
      <IndexTable.Cell>{order.order_ref.zone_id?.title}</IndexTable.Cell>
      <IndexTable.Cell>{dateFormate(order.createdAt)}</IndexTable.Cell>

      <IndexTable.Cell>
        <Badge status={badgeStatus(order.order_ref.delivery_status)} progress={badgeProgress(order.order_ref.delivery_status)}> {remove_(order.order_ref.delivery_status, true)} </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge status={badgeStatus(order.fulfillment_status || 'Unfulfilled')} progress={badgeProgress(order.fulfillment_status || 'Unfulfilled')}>
          {uppercase(order.fulfillment_status || 'Unfulfilled')}
        </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Button plane onClick={() => { handelOrderDetails(order.order_ref._id) }}> View </Button>
      </IndexTable.Cell>

    </IndexTable.Row>
  ));


  const bulkOrderAssignResponseBannerMsg = bannerActive ? (
    <Banner status="warning" onDismiss={() => setBannerActive(false)}>
      <List type="bullet"> {buldOrdersAssignMsg.map((msg, index) => <List.Item key={index}>{msg}</List.Item>)} </List>
    </Banner>) : null;


  return (
    <SideNavBarDelivery>
      <Page title="All Sales Orders">
        <TopBanner orderCount={ordreAnalytics} handelFilterByStatus={setOrderType} />
        {bulkOrderAssignResponseBannerMsg}
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
                  // onBlur={(value) => { value && setOrders(ordersBackup) }}
                  clearButton
                  onClearButtonClick={handleClearButton}
                  connectedRight={<Button loading={searching} disabled={!searchText ? true : false} onClick={handleSearch}>Search</Button>}
                />
              </Stack.Item>
            </Stack>
          </Card.Section>
          {orders.length ? <IndexTable
            resourceName={resourceName}
            loading={searching}
            selectable={false}
            itemCount={orders?.length}
            emptyState={<EmptyDataState title="No Orders Yet" message="Upcoming orders with mentioned area pin code in the warehouse zones will auto sync and list here." />}
            headings={[
              // { title: '#' },
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

          </IndexTable> : isLoading ? <EmptyDataState title="Please wait" message="Fetching orders..." /> : <EmptyDataState title="No Match Found" message="Clear the search field to bring back all orders" />}
          <Card.Section>
            {!appliedfilter ?
              <Stack alignment="center">
                <Stack.Item fill>
                  <p>{`Showing ${orders?.length} of ${totalOrders || 0} orders`}</p>
                </Stack.Item>
                <Stack.Item >
                  <Select labelInline label="View" options={RangeOptions} onChange={handleRangeSelectChange} value={selectedRange} />
                </Stack.Item>

                <Stack.Item >
                  <Select labelInline label="Page" options={pageOptions} onChange={handlePageJumpSelectChange} value={parseInt(selectedPage)} onFocus={makeJumpPageOptions} />
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
              orders?.length > 0 && <Stack alignment="center">
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
    </SideNavBarDelivery>
  )
}

Orders.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true
}

export default Orders
