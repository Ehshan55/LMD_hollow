import { Navigation, Frame, TopBar } from '@shopify/polaris'
import { MobileMajor, CustomersMajor, ArrowLeftMinor, OrdersMajor, ProductsMajor, SettingsMajor, ManagedStoreMajor, InventoryMajor } from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { validateUserType } from '../utils/validateUserType';
import Topbar from './Topbar';
import CookiesJs from 'js-cookie';
import { DataContext } from '../contexts/DataContext';
import ModalPopup from './modal';


import ApiService from '../apiservices/deliveryApiService';
const apiRequestService = new ApiService();

const SideNavBarDelivery = (props) => {
  const { toastMarkup, constructTostStates, setOrdreAnalytics, setStoreName, loadingMarkup } = useContext(DataContext);
  let userInicator = 'delivery';
  const router = useRouter();
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [user, setUser] = useState({});
  const [userInitial, setUserInitial] = useState('');
  const [storeId, setStoreId] = useState('');
  const [totalOrdersCount, setTotalOrdersCount] = useState('');
  const [userId, setUserId] = useState('');


  const [modalActive, setModalActive] = useState(false);


  const userMenuActions = [
    {
      items: [{ content: user.email }],
    },
  ];

  const handelUserMenuToggel = () => {
    setUserMenuActive((userMenuActive) => !userMenuActive);
    if (userMenuActive) {
      navigator.clipboard.writeText(storeId).then(() => { constructTostStates('Store Id Copied') })
    }
  }

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={user?.name || 'Guest'}
      detail={storeId}
      initials={userInitial || 'G'}
      open={userMenuActive}
      onToggle={handelUserMenuToggel}
    />
  );

  const toggleMobileNavigationActive = useCallback(() =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive,),
    [],
  );

  const topBarMarkup = (
    <Topbar
      userMenuMarkup={userMenuMarkup}
      toggleMobileNavigationActive={toggleMobileNavigationActive}
    />
  );

  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    [],
  );


  const navigationMarkup = (<Navigation location="/">
    <Navigation.Section
      title="Delivery's Dashboard"
      items={[
        {
          url: '/delivery/dashboard',
          label: 'Orders',
          icon: OrdersMajor,
          // badge: `${totalOrdersCount}`,
          selected: router.pathname == '/delivery/dashboard' ? true : false,
        },
        {
          url: '/delivery/routes',
          label: 'Routes',
          icon: SettingsMajor,
          selected: (router.pathname == '/delivery/routes') || (router.pathname == '/delivery/routes/route-details') ? true : false,
        },

      ]}
    />

    <Navigation.Section
      separator
      items={[
        {
          label: 'Logout',
          icon: ArrowLeftMinor,
          onClick: toggleModalActive,
        },
      ]}
    />
  </Navigation>)

  // setting data
  useEffect(() => {
    ;
    apiRequestService.getDeliveryProfile((adminData) => {
      if (adminData) {
        // console.log(adminData);
        let data = validateUserType(adminData, userInicator, router);
        if (data) {
          setUser(data.userDetails || '');
          setUserInitial(data.userDetails.name.charAt(0) + data.userDetails.name.charAt(data.userDetails.name.indexOf(' ') + 1));
          setStoreId(data.storeDetails.store_id);
          let store_url = data.storeDetails.store_url;
          let store_name = store_url.substring(0, store_url.indexOf('.'));
          CookiesJs.set('storeName', store_name);
          setStoreName(store_name);
          setUserId(data.userDetails._id);

          apiRequestService.getDeliveryDashboardAnalytics((ordreAnalytics) => {
            if (ordreAnalytics) {
              setTotalOrdersCount(ordreAnalytics.all.count);
              setOrdreAnalytics(ordreAnalytics);
            }
          });
        }
      }
    });
  }, [])


  // *Constructing logout confirmation modal
  const modalMarkup = (
    <ModalPopup
      modalActive={modalActive}
      toggleModalActive={toggleModalActive}
    />
  );
  return (

    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {loadingMarkup}
      {props.children}
      {toastMarkup}
      {modalMarkup}
    </Frame>
  )
}


export default SideNavBarDelivery
