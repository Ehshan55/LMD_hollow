import { Badge, Button, Card, IndexTable, Page, PageActions, Pagination, Stack, TextStyle, Checkbox, Banner, List, Link, Select, TextField, Tabs } from '@shopify/polaris';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import EmptyDataState from '../components/emptyDataState';
import TopBanner from '../components/topBanner';

import AllOrdersTable from '../components/order_table/allOrderTable';
import AssignedOrderTable from '../components/order_table/assignedOrderTable';
import UnAssignedOrderTable from '../components/order_table/unAssignedOrderTable';

import { badgeProgress, badgeStatus } from '../utils/customBadge';
import { dateFormate } from '../utils/dateFormate';
import { formatStatusTxt, remove_, uppercase } from '../utils/textFormate';

import { validateLogin } from '../contexts/AuthContext';
import LoaderContext from '../contexts/LoaderContext';
import { DataContext } from '../contexts/DataContext';

import CookiesJs from 'js-cookie';

import AdminApiService from '../apiservices/adminApiService';
const adminApiRequestService = new AdminApiService();

const MutualDashboardOrders = () => {
  // const router = useRouter();

  const { showLoader } = useContext(LoaderContext);
  const { ordreAnalytics, storeName, setTopLoading, constructTostStates } = useContext(DataContext);


  const [pageType, setPageType] = useState('all');
  const [pageNo, setPageNo] = useState(1);
  const [allPages, setAllPages] = useState();
  const [size, setSize] = useState();
  const [orderType, setOrderType] = useState('all');
  const [totalPages, setTotalPages] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [orders, setOrders] = useState([]);
  // const ordersBackup = [];

  const [refetchData, setRefetchData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [ordersBackup, setOrdersBackup] = useState([]);

  const [buldOrdersAssignMsg, setBuldOrdersAssignMsg] = useState([{}]);
  const [bannerActive, setBannerActive] = useState(false);
  const [zoneBannerActive, setZoneBannerActive] = useState(false);
  const [scriptBannerActive, setScriptBannerActive] = useState(false);

  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedRange, setSelectedRange] = useState('');

  const [PageOptions, setPageOptions] = useState([]);

  const [selectedSearchOption, setSelectedSearchOption] = useState('by_order_id');

  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [appliedfilter, setAppliedfilter] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

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


  // TODO: Could be use To open multipal selected orders on one button click in multipal tabs (May use is future)
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
    window.open(`/order-details/${orderId}`, '_blank');
  };

  // * Tab selection handler
  const tabSelectionHandler = (tabIndex) => {
    setSelectedTab(tabIndex);
    pageTypeHandller(tabIndex);
    setPageNo(1);
    setSelectedPage(1);
  }
  // * Setting page selection by active tab
  const pageTypeHandller = (tabIndex) => {
    if (tabIndex == 0) {
      setPageType('all');
    } else if (tabIndex == 1) {
      setPageType('by_zone');
    } else if (tabIndex == 2) {
      setPageType('others');
    } else {
      setPageType('all');
    }
  }

  //* To add jump to specific page no feature
  const handlePageJumpSelectChange = (value) => {
    if (value) {
      setPageNo(value);
      setSelectedPage(value);
    }
  }

  //* on order range select
  const handleRangeSelectChange = (value) => {
    if (value) {
      setPageNo(1);
      setSize(value);
      setSelectedRange(value);
    }
    if (!selectedRange) {
      setSelectedPage(1);
    }
  }

  //* making page jump obtions dynamically
  const makeJumpPageOptions = () => {
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
  const handleSelectChange = (value) => {
    setSelectedSearchOption(value);
    setSearchText('');
    // setOrders(ordersBackup);
    setAppliedfilter(false);
    setSelectedRange('');
  }


  //* on search input change
  const handleFilter = (value) => {
    if (!value) {
      // setOrders(ordersBackup);
    }
    setSearchText(value);
  }


  //* search api call
  const handleSearch = () => {
    setSearching(true);
    // adminApiRequestService.getAdminDashboardOrders(pageType, '', size, '', searchText, selectedSearchOption, '', (responseData) => {
    //   if (responseData) {
    //     setOrders(responseData.api_data.orders);
    //     // setAppliedfilter(true);
    //     setSearching(false);
    //   }
    // })
    orderFetchingHandller();
  }


  //* on search button clear press
  const handleClearButton = () => {
    // setOrders(ordersBackup);
    setRefetchData((refetchData) => !refetchData);
    setSearchText('');
    setAppliedfilter(false);
  }

  //* handle next
  const paginationPrev = () => {
    if (pageNo != 1) {
      setPageNo(parseInt(pageNo) - 1);
      setSelectedPage(pageNo - 1);
    };
  }
  //* handle previous
  const paginationNext = () => {
    if (totalPages != pageNo) {
      setPageNo(parseInt(pageNo) + 1);
      setSelectedPage(pageNo + 1);
    };
  }


  //* using another useEffect for just order refreshing while pagination and filtering
  useEffect(() => {
    orderFetchingHandller();
  }, [refetchData, pageType, pageNo, orderType, size])

  const orderFetchingHandller = () => {
    showLoader(true);
    setTopLoading(true);
    if (ordreAnalytics) {
      setIsLoading(true);
      adminApiRequestService.getAdminDashboardOrders(pageType, pageNo, size, orderType, searchText, selectedSearchOption, '', (responseData) => {
        if (responseData) {
          // console.log(responseData);
          let adminsOrder = responseData.api_data;
          setOrders(adminsOrder.orders);
          setOrdersBackup(adminsOrder.orders);
          setTotalOrders(adminsOrder.total_orders);
          setTotalPages(adminsOrder.total_pages);
          setAllPages(responseData.numUrls);
          setIsLoading(false);
          showLoader(false);
          setTopLoading(false);
          setSearching(false);
        } else {
          console.log('Undefined Response from getAdminDashboardOrders ');
          showLoader(false);
          setTopLoading(false);
          setSearching(false);
        }
      });
    }
  }

  // * checking if zone and script is create/injected or not
  useEffect(() => {
    adminApiRequestService.getCheckForZoneExistance((response) => {
      if (response) {
        if (!response.zone_existance) {
          setZoneBannerActive(true);
        }
        else {
          setZoneBannerActive(false);
        }
      }
    })
    adminApiRequestService.getCheckThemeScriptStatus((response) => {
      if (response) {
        // console.log(response)
        if (!response.script_status) {
          setScriptBannerActive(true);
        }
        else {
          setScriptBannerActive(false);
        }
      }
    })
  }, []);

  // * Conditional banners markup
  const bulkOrderAssignResponseBannerMsg = bannerActive ? (
    <Banner status="warning" onDismiss={() => setBannerActive(false)}>
      <List type="bullet"> {buldOrdersAssignMsg?.map((msg, index) => <List.Item key={index}>{msg}</List.Item>)} </List>
    </Banner>) : null;
  const warehouseZoneBanner = zoneBannerActive ? (
    <Banner status="warning"
      onDismiss={() => setZoneBannerActive(false)}
      title="Warehouse zone not found.">
      <p> Zone is required to sync upcomming shopify orders. You can create one from <Link url="/admin/warehouse"> warehouses</Link></p>
    </Banner>) : null;
  const scriptBanner = scriptBannerActive ? (
    <Banner status="warning"
      onDismiss={() => setScriptBannerActive(false)}
      title="Store theme not configured">
      <p>Dragable map not activated for store thank you page.</p><p> Please <Link url="/admin/routes/geo-location"> activate</Link> in order to
        let the customers pin point their exact delivery location and to optimise delivery route feature.</p>
    </Banner>) : null;


  // * Tab tables markup
  const tabsOptions = [
    {
      id: "all_orders",
      content: "All Orders",
      view: < >
        {warehouseZoneBanner}{scriptBanner} <br />
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
                    onChange={(value) => handleSelectChange(value)}
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
                  connectedRight={<Button loading={searching} disabled={!searchText ? true : false} onClick={() => handleSearch()}>Search</Button>}
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
            <AllOrdersTable order_list={orders} onHandleOrderDetails={handelOrderDetails} loader_status={searching} appliedfilter={appliedfilter}
              adminApiRequestService={adminApiRequestService} constructTostStates={constructTostStates} />
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
                  <Select disabled={orders?.length == 0} labelInline label="View" options={RangeOptions} onChange={(value) => handleRangeSelectChange(value)} value={selectedRange} />
                </Stack.Item>

                <Stack.Item >
                  <Select labelInline label="Page" options={PageOptions} onChange={(value) => handlePageJumpSelectChange(value)} value={parseInt(selectedPage)} onFocus={makeJumpPageOptions} />
                </Stack.Item>

                <Stack.Item >
                  <Pagination
                    label={'Page : ' + pageNo + ' of ' + (totalPages || 1)}
                    hasPrevious
                    onPrevious={paginationPrev}
                    hasNext
                    onNext={paginationNext}
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
      </>
    },
    {
      id: "orders_by_zone",
      content: "By Zone",
      view: < >
        {warehouseZoneBanner}{scriptBanner} <br />
        {/* <TopBanner orderCount={ordreAnalytics} handelFilterByStatus={setOrderType} /> */}
        {/* {bulkOrderAssignResponseBannerMsg} */}
        <br />
        <Card>
          <Card.Section>
            <Stack>
              <Stack.Item>
                <TextField
                  connectedLeft={<Select
                    placeholder="Search By"
                    options={searchTypeOptions}
                    onChange={(value) => handleSelectChange(value)}
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
                  <Select disabled={orders?.length == 0} labelInline label="View" options={RangeOptions} onChange={(value) => handleRangeSelectChange(value)} value={selectedRange} />
                </Stack.Item>

                <Stack.Item >
                  <Select labelInline label="Page" options={PageOptions} onChange={(value) => handlePageJumpSelectChange(value)} value={parseInt(selectedPage)} onFocus={makeJumpPageOptions} />
                </Stack.Item>

                <Stack.Item >
                  <Pagination
                    label={'Page : ' + pageNo + ' of ' + (totalPages || 1)}
                    hasPrevious
                    onPrevious={paginationPrev}
                    hasNext
                    onNext={paginationNext}
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
      </>
    },
    {
      id: "other_orders",
      content: "Others",
      view: <>
        {warehouseZoneBanner}{scriptBanner} <br />
        {/* <TopBanner orderCount={ordreAnalytics} handelFilterByStatus={setOrderType} />
        {bulkOrderAssignResponseBannerMsg} */}
        <br></br>
        <Card>
          <Card.Section>
            <Stack>
              <Stack.Item>
                <TextField
                  connectedLeft={<Select
                    placeholder="Search By"
                    options={searchTypeOptions}
                    onChange={(value) => handleSelectChange(value)}
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
            </Stack>
          </Card.Section>
          {!isLoading ?
            <UnAssignedOrderTable order_list={orders} onHandleOrderDetails={handelOrderDetails} loader_status={searching} appliedfilter={appliedfilter} />
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
                  <Select disabled={orders?.length == 0} labelInline label="View" options={RangeOptions} onChange={(value) => handleRangeSelectChange(value)} value={selectedRange} />
                </Stack.Item>

                <Stack.Item >
                  <Select labelInline label="Page" options={PageOptions} onChange={(value) => handlePageJumpSelectChange(value)} value={parseInt(selectedPage)} onFocus={makeJumpPageOptions} />
                </Stack.Item>

                <Stack.Item >
                  <Pagination
                    label={'Page : ' + pageNo + ' of ' + (totalPages || 1)}
                    hasPrevious
                    onPrevious={paginationPrev}
                    hasNext
                    onNext={paginationNext}
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
      </>
    }
  ];


  return (
    <Tabs tabs={tabsOptions} selected={selectedTab} onSelect={(selectedTabIndex) => tabSelectionHandler(selectedTabIndex)} >
      <Card.Section>{tabsOptions[selectedTab].view}</Card.Section>
    </Tabs>
  );
};

MutualDashboardOrders.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true;
}

export default MutualDashboardOrders;


