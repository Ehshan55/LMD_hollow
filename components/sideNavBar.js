import { Navigation, Frame, TopBar, ActionList, Icon, VisuallyHidden } from '@shopify/polaris'
import {
  HomeMajor,
  MobileMajor,
  PromoteMinor,
  ArrowLeftMinor,
  ChatMajor,
  OrdersMajor,
  ProductsMajor,
  SettingsMinor,
  ProfileMajor,
  LocationMajor,
  ShipmentMajor,
  ChannelsMajor,
  LogOutMinor,
  ConversationMinor,
  FlagMajor,
  ThemeEditMajor,
  SoftPackMajor,
  NotificationMajor
} from '@shopify/polaris-icons';

import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import logoApp from '../utils/logoObject';
import Topbar from './Topbar';
import CookiesJs from 'js-cookie';
import { DataContext } from '../contexts/DataContext';
import ModalPopup from './modal';

import AdminApiService from '../apiservices/adminApiService';
const adminApiService = new AdminApiService();

const SideNavBar = (props) => {
  const { toastMarkup, constructTostStates, setOrdreAnalytics, setStoreName, loadingMarkup } = useContext(DataContext);
  let userInicator = 'vendor';
  const router = useRouter();
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState({});
  const [userInitial, setUserInitial] = useState('');
  const [storeId, setStoreId] = useState('');
  const [newOrdersCount, setNewOrdersCount] = useState('');

  const [modalActive, setModalActive] = useState(false);

  const userMenuActions =
    [
      {
        // title: 'Admin',
        items: [
          { content: 'Online Store', icon: PromoteMinor },
          { content: 'Account', icon: SettingsMinor, onAction: () => router.push({ pathname: '/temp/profile', }), active: router.pathname == '/temp/profile' },
          { content: 'Support', icon: ConversationMinor },
          { content: 'Logout', icon: LogOutMinor, onAction: () => toggleModalActive() },
        ],
      }
    ];

  const handelUserMenuToggel = () => {
    setUserMenuActive((userMenuActive) => !userMenuActive);
    // if (userMenuActive) {
    //   navigator.clipboard.writeText(storeId).then(() => { constructTostStates('Store Id Copied') })
    // }
  }
  const toggleIsSecondaryMenuOpen = () => {
    setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen)
  }

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setIsSearchActive(value.length > 0);
  }

  const handleSearchResultsDismiss = () => {
    setIsSearchActive(false);
    setSearchValue("");
  }


  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={((user?.first_name || 'Admin') + ' ' + (user.last_name || ''))}
      // detail={storeId || 'Fetching'}
      initials={userInitial || 'A'}
      open={userMenuActive}
      onToggle={handelUserMenuToggel}
    />
  );

  const secondaryMenuMarkup = (
    <TopBar.Menu
      activatorContent={
        <span>
          <Icon source={FlagMajor} />
          <VisuallyHidden>Secondary menu</VisuallyHidden>
        </span>
      }
      open={isSecondaryMenuOpen}
      onOpen={toggleIsSecondaryMenuOpen}
      onClose={toggleIsSecondaryMenuOpen}
      actions={[
        {
          items: [{ content: "Community forums" }]
        }
      ]}
    />
  );

  const toggleMobileNavigationActive = useCallback(() =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive,),
    [],
  );

  const handleNavigationToggle = useCallback(() => {
    console.log("toggle navigation visibility");
  }, []);

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Search"
      showFocusBorder
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: "Shopify help center" },
        { content: "Community forums" }
      ]}
    />
  );

  const topBarMarkup = (
    <Topbar
      showNavigationToggle

      userMenuMarkup={userMenuMarkup}
      secondaryMenu={secondaryMenuMarkup}

      searchResultsVisible={isSearchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}

      onNavigationToggle={handleNavigationToggle}

      toggleMobileNavigationActive={toggleMobileNavigationActive}
    />
  );

  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    [],
  );


  const navigationMarkup = (<Navigation location="/">
    <Navigation.Section
      title="Dashboard"
      items={[
        {
          url: '/home/',
          label: 'Home',
          icon: HomeMajor,
          selected: router.pathname == '/home' ? true : false,
        },
        {
          url: '/orders',
          label: 'Orders',
          icon: OrdersMajor,
          badge: `${newOrdersCount || 0}`,
          selected: router.pathname == '/orders' ? true : false,
        },
        {
          url: '/routes',
          label: 'Routes',
          icon: ShipmentMajor,
          selected: router.pathname == '/routes' ? true : false,
          // onClick: executivesPage,
        },
      ]}

    />
    <Navigation.Section
      title="Shipment & Logistics"
      separator
      items={[
        {
          url: '/locations',
          label: 'Locations',
          icon: LocationMajor,
          selected: router.pathname == '/locations' ? true : false,
          // onClick: executivesPage,
        },
        {
          url: '/profile',
          label: 'Zones',
          icon: ChannelsMajor,
          selected: router.pathname == '/profile' ? true : false,
          // onClick: executivesPage,
        }
      ]}

    />
    <Navigation.Section
      title="Users & Permissions"
      separator
      items={[
        {
          url: '/profile',
          label: 'Users',
          icon: ProfileMajor,
          selected: router.pathname == '/profile' ? true : false,
          // onClick: executivesPage,
        },
      ]}
    />
    <Navigation.Section
      title="Configurations"
      separator
      items={[
        {
          url: '/plans/',
          label: 'Theme configuration',
          icon: ThemeEditMajor,
          selected: router.pathname == '/plans' ? true : false,
          // onClick: plansPage,
        },
        {
          url: '/plans/',
          label: 'Tracking',
          icon: SoftPackMajor,
          selected: router.pathname == '/plans' ? true : false,
          // onClick: plansPage,
        },
        {
          url: '/plans/',
          label: 'Notifications',
          icon: NotificationMajor,
          selected: router.pathname == '/plans' ? true : false,
          // onClick: plansPage,
        },
      ]}
    />

    <div style={{ flex: '1 0 auto' }} />

    <Navigation.Section
      // title="Configurations"
      separator
      items={[
        {
          url: '/plans/',
          label: 'Billing & Plans',
          icon: ProductsMajor,
          selected: router.pathname == '/plans' ? true : false,
          // onClick: plansPage,
        },
        {
          url: '/settings',
          label: 'Settings',
          icon: SettingsMinor,
          selected: router.pathname == '/settings' ? true : false,
          // onClick: settingsPage,
        },
      ]}
    />
    {/* <Navigation.Section
      separator
      items={[
        {
          label: 'Logout',
          icon: ArrowLeftMinor,
          onClick: toggleModalActive,
        },
      ]}
    /> */}
  </Navigation>)



  //* setting data
  useEffect(() => {
    adminApiService.getAdminProfile((responseData) => {
      if (responseData) {
        let adminData = responseData;
        // let data = validateUserType(adminData, userInicator, router);
        // if (data) {
        setUser(adminData || '');
        setUserInitial(adminData.first_name.charAt(0) + adminData.last_name.charAt(0));
        setStoreId(CookiesJs.get('store_id'));
        let store_url = CookiesJs.get('store_url');
        let store_name = store_url.substring(0, store_url.indexOf('.'));
        CookiesJs.set('storeName', store_name);
        setStoreName(store_name);

        // adminApiService.getAdminDashboardAnalytics((ordreAnalytics) => {
        //   if (ordreAnalytics) {
        //     setNewOrdersCount(ordreAnalytics.new?.count);
        //     setOrdreAnalytics(ordreAnalytics);
        //   }
        // });
        // }
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
  const logo = {
    width: 124,
    topBarSource: '/images/logo.png',
    contextualSaveBarSource: '/images/logo.png',
    accessibilityLabel: 'Digirex',
  }
  return (

    <Frame
      logo={logoApp}
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


export default SideNavBar


