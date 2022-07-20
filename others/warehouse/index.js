import { Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle, Thumbnail } from '@shopify/polaris';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import EmptyResourceList from '../../../components/emptyResourceList';
import SideNavBar from '../../../components/sideNavBar';

import { validateLogin } from '../../../contexts/AuthContext';
import { DataContext } from '../../../contexts/DataContext';

import { buttonName } from '../../../utils/hardCoded';

import adminApiService from '../../../apiservices/adminApiService';
const ApiRequestService = new adminApiService();

const Warehouse = () => {

  const { changeWarehouseData } = useContext(DataContext);
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // * Getting all available Warehouses
  useEffect(() => {
    // console.log('\warehouseData ', warehouseData);
    ApiRequestService.getAllWarehouses((responseArray) => {
      if (responseArray) {
        setWarehouses(responseArray);
        setIsLoading(false);
      }
    });
  }, []);

  // *navigating to WarehouseZones page
  const handleNavigateToWarehouseZones = (item) => {
    // console.log('item', item);
    changeWarehouseData(item);
    // console.log('warehouseData ', warehouseData);
    router.push({
      pathname: '/admin/warehouse/zones',
    });

  }
  // *navigating to add Warehouse
  const handleNavigateToCreateWarehouse = () => {
    // console.log('item', item);
    router.push({
      pathname: '/admin/warehouse/add',
    });

  }

  return (
    <SideNavBar>
      <Page title="Warehouses">
        <Layout>
          <Layout.Section>
            <Banner title="Create warehouse-zones with area pin-codes to sync and manage your orders" status="info">
              <p>Click on any warehouse to create their zones</p>
            </Banner>
          </Layout.Section>
          <Layout.AnnotatedSection
            title="Warehouses"
            description="You can edit and manage all available warehouse here"
          >
            <Card>
              <ResourceList
                loading={isLoading}
                emptyState={warehouses.length == 0 && <EmptyResourceList heading="No warehouse yet" content="Please create one to define order delivery zones." />}
                resourceName={{ singular: 'warehouse', plural: 'warehouses' }}
                items={warehouses?.map((warehouse, index) => {
                  return {
                    id: warehouse?._id,
                    name: warehouse?.title,
                    location: warehouse.address?.city,
                    state: warehouse.address?.state,
                  };
                })}
                renderItem={(item) => {
                  const { id, name, location, state } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'View',
                        onAction: () => handleNavigateToWarehouseZones(item),
                      },
                    ]
                    : null;
                  const media = <Thumbnail size="small" source="/images/InventoryMajor.svg" alt="Warehouse" />;

                  return (
                    <ResourceItem
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                      shortcutActions={shortcutActions}
                      onClick={() => handleNavigateToWarehouseZones(item)}
                    >
                      <h3><TextStyle variation="strong">{name}</TextStyle></h3>
                      <div>{location}</div>
                      <div>{state}</div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.AnnotatedSection>
        </Layout>

        <PageActions
          primaryAction={{
            loading: isLoading,
            content: warehouses.length == 0 ? buttonName.warehouse.add : buttonName.warehouse.new,
            onAction: handleNavigateToCreateWarehouse,
          }}
        />
      </Page>
    </SideNavBar>
  );
};

Warehouse.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true;
}

export default Warehouse;
