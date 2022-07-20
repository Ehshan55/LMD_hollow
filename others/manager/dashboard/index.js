import { Badge, Button, Card, IndexTable, Page, PageActions, Pagination, Stack, TextStyle, Checkbox, Banner, List, Link, Select, TextField } from '@shopify/polaris';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import SideNavBarManager from "../../../components/sideNavBarManager"
import EmptyDataState from '../../../components/emptyDataState';
import TopBanner from '../../../components/topBanner';

import { badgeProgress, badgeStatus } from '../../../utils/customBadge';
import { dateFormate } from '../../../utils/dateFormate';
import { remove_, uppercase } from '../../../utils/textFormate';

import { validateLogin } from '../../../contexts/AuthContext';
import LoaderContext from '../../../contexts/LoaderContext';
import { DataContext } from '../../../contexts/DataContext';

import CookiesJs from 'js-cookie';

import ApiService from '../../../apiservices/managerApiService';
const managerApiRequestService = new ApiService();


const ManagerDashboard = () => {

  // const router = useRouter();

  const { showLoader } = useContext(LoaderContext);
  const { ordreAnalytics, storeName, setTopLoading, constructTostStates } = useContext(DataContext);

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

  const [checkedOrders, setCheckedOrders] = useState([]);

  const [buldOrdersAssignMsg, setBuldOrdersAssignMsg] = useState([{}]);
  const [bannerActive, setBannerActive] = useState(false);

  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRange, setSelectedRange] = useState('');

  const [PageOptions, setPageOptions] = useState([]);

  const [selectedSearchOption, setSelectedSearchOption] = useState();

  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [Appliedfilter, setAppliedfilter] = useState(false);

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

  // TODO: Could be use inplace if pageRefresh state
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
  const handelOrderDetails = (orderId, userId) => {
    // router.push({
    //   pathname: '/order_details',
    //   query: { orderId, userId },
    // });
    window.open(`/order-details/${orderId}`, '_blank');
  };


  //* To handle checkbox selection
  const handleCheckboxChange = (id) => {
    if (!checkedOrders.includes(id)) {
      // console.log('Add ', id);
      setCheckedOrders([...checkedOrders, id])
    } else {
      // console.log('Remove ', id);
      const index = checkedOrders.indexOf(id);
      if (index > -1) {
        checkedOrders.splice(index, 1)
        setCheckedOrders([...checkedOrders]);
      }
    }
  };


  //*Function to assign bulk orders */
  const handelAssignOrders = () => {
    // console.log('Assign Orders ', checkedOrders);
    showLoader(true);
    if (checkedOrders?.length) {
      let bulkMsgs = [];
      managerApiRequestService.postAssignBulkOrdersToDeliveryExecutive({ order_ids: checkedOrders },
        (responseData) => {
          if (responseData) {
            // console.log(responseData);
            responseData.map((data) => {
              bulkMsgs.push(data.msg);
              setRefetchData(Math.random());
              showLoader(false);
            });
            setBuldOrdersAssignMsg(bulkMsgs);
            setBannerActive(true);
            constructTostStates('Orders Processed');
          }
        },
      );
    }
    else {
      constructTostStates('Please select an order to assign', true);
      showLoader(false);
    }
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
    // router.push({
    //   pathname: '/customer',
    //   query: { storeUrl: props.storeUrl },
    // });
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
    setSelectedRange('');
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
    managerApiRequestService.getManagerDashboardOrders('', '', '', searchValue, searchType, (responseData) => {
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
      managerApiRequestService.getManagerDashboardOrders(pageNo, size, orderType, '', '', (responseData) => {
        if (responseData) {
          // console.log(responseData);
          let adminsOrder = responseData.api_data;
          setOrders(adminsOrder.orders);
          ordersBackup = adminsOrder.orders;
          setTotalOrders(adminsOrder.total_orders);
          setTotalPages(adminsOrder.total_pages);
          setAllPages(responseData.numUrls);
          setIsLoading(false);
          showLoader(false);
          setTopLoading(false);

        } else {
          console.log('Undefined Response from getManagerDashboardOrders ',);
          showLoader(false);
          setTopLoading(false);
        }
      });
    }

  }, [refetchData, pageNo, orderType, size])


  const rowMarkup = orders.map((order, index) => (
    <IndexTable.Row id={order._id} key={index} position={index}>

      <IndexTable.Cell>
        <Checkbox checked={order.is_assigned || checkedOrders.includes(order._id)} disabled={order.is_assigned} onChange={() => handleCheckboxChange(order._id)} />
      </IndexTable.Cell>

      <IndexTable.Cell><TextStyle variation="strong">{order.name}</TextStyle> </IndexTable.Cell>
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
        <Button plane onClick={() => { handelOrderDetails(order._id); }}> View </Button>
      </IndexTable.Cell>

    </IndexTable.Row>
  ));


  const bulkOrderAssignResponseBannerMsg = bannerActive ? (
    <Banner status="warning" onDismiss={() => setBannerActive(false)}>
      <List type="bullet"> {buldOrdersAssignMsg.map((msg, index) => <List.Item key={index}>{msg}</List.Item>)} </List>
    </Banner>) : null;

  return (
    <SideNavBarManager>
      <Page title="All Sales Orders">
        <TopBanner orderCount={ordreAnalytics} handelFilterByStatus={setOrderType} />
        {bulkOrderAssignResponseBannerMsg}
        {/* <PageActions
          primaryAction={{
            content: 'Auto Assign Order',
            onAction: handelAssignOrders,
          }}
        /> */}
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
              { title: '#' },
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

          </IndexTable> : isLoading ? <EmptyDataState title="Loading" message="Fetching orders" /> : <EmptyDataState title="No Match Found" message="Clear the search field to bring back all orders" />}
          <Card.Section>
            {!Appliedfilter ?
              <Stack alignment="center">
                <Stack.Item fill>
                  <p>{`Showing ${orders?.length} of ${totalOrders || 0} orders`}</p>
                </Stack.Item>
                <Stack.Item >
                  <Select labelInline label="View" options={RangeOptions} onChange={handleRangeSelectChange} value={selectedRange} />
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
    </SideNavBarManager>
  )
}

ManagerDashboard.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true;
}

export default ManagerDashboard
