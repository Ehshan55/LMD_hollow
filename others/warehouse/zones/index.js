import { Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle, Thumbnail } from '@shopify/polaris';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import EmptyResourceList from '../../../../components/emptyResourceList';
import SideNavBar from '../../../../components/sideNavBar';

import { validateLogin } from '../../../../contexts/AuthContext';
import { DataContext } from '../../../../contexts/DataContext';

import { buttonName, pageTitle } from '../../../../utils/hardCoded';

import adminApiService from '../../../../apiservices/adminApiService';
const apiRequestService = new adminApiService();

const WarehouseZones = () => {

  const router = useRouter();
  const { warehouseData } = useContext(DataContext);
  const [zones, setZones] = useState([]);
  const [isloading, setIsloading] = useState(true);

  //* Getting warehouse zones
  useEffect(() => {

    if (warehouseData.id) {
      apiRequestService.getDeliveryZonesByWarehouseId(warehouseData.id, (responseArray) => {
        // console.log(responseArray);
        if (responseArray) {
          setZones(responseArray);
          setIsloading(false);
        }
      });
    }
    else {
      router.back();
    }
  }, []);

  //* Navigating to Zone Edit page
  const warehouseManage = (warehouseId) => {
    router.push({
      pathname: '/admin/warehouse/edit/',
      query: { id: warehouseId },
    });
  }

  //* Navigating to zone Edit page
  const warehouseZoneEdit = (zoneId) => {
    router.push({
      pathname: '/admin/warehouse/zones/edit/',
      query: { id: zoneId },
    });
  }
  //* Navigating to zone Add page
  const warehouseZoneAdd = () => {
    router.push({
      pathname: '/admin/warehouse/zones/add/',
    });
  }



  return (
    <SideNavBar>
      <Page title={pageTitle._warehouse}
        breadcrumbs={[{ content: 'Products', onAction: () => router.back() }]}
      >
        <Layout>
          <Layout.Section>
            <Card sectioned >
              <ResourceList
                items={[
                  {
                    id: warehouseData.id,
                    name: warehouseData.name,
                    state: warehouseData.state,
                    location: warehouseData.location,
                  },
                ]}
                renderItem={(item) => {
                  const { id, name, location, state } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'Edit',
                        onAction: () => warehouseManage(id),
                      },
                    ]
                    : null;
                  const media = <Thumbnail size="large" source="/images/InventoryMajor.svg" alt="Warehouse" />;

                  return (
                    <ResourceItem
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                      shortcutActions={shortcutActions}
                      onClick={() => warehouseManage(id)}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
                      <div>{location}</div>
                      <div>{state}</div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.Section>
          <Layout.AnnotatedSection
            title="Warehouse Zones"
            description="You can edit and manage all available warehouse zones here"
          >
            <Card>
              <ResourceList
                loading={isloading}
                emptyState={zones?.length == 0 && <EmptyResourceList heading="No zones associated yet with this warehouse" content="Please create one with area pin codes for order syncing." />}
                items={zones?.map((zone, index) => {
                  return {
                    id: zone?._id,
                    name: zone?.title,
                    location: zone.address?.city,
                    state: zone.address?.state,
                  };
                })}
                renderItem={(item) => {
                  const { id, name, location, state } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'View',
                        onAction: () => warehouseZoneEdit(id),
                      },
                    ]
                    : null;
                  const media = <Thumbnail size="small" source="/images/LocationMajor.svg" alt="Warehouse" />;

                  return (
                    <ResourceItem
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                      shortcutActions={shortcutActions}
                      onClick={() => warehouseZoneEdit(id)}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
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
            loading: isloading,
            content: zones?.length == 0 ? buttonName.zone.add : buttonName.zone.new,
            onAction: warehouseZoneAdd,
          }}
        />

      </Page>
    </SideNavBar>
  );
};

WarehouseZones.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true
}

export default WarehouseZones;
