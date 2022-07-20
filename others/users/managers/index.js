import { Avatar, Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import SideNavBar from '../../../../components/sideNavBar';
import EmptyResourceList from '../../../../components/emptyResourceList';

import { validateLogin } from '../../../../contexts/AuthContext';

import { buttonName } from '../../../../utils/hardCoded';

import adminApiService from '../../../../apiservices/adminApiService';
import ConfirmationModalPopup from '../../../../components/confirmDeleteModal';
const apiRequestService = new adminApiService();

const Manager = () => {

  const router = useRouter();
  const [managers, setManagers] = useState([]);
  const [isloading, setIsloading] = useState(true);

  const [confirmationModalActive, setConfirmationModalActive] = useState(false);
  const [deletingManagerName, setDeletingManagerName] = useState('');
  const [deletingManagerId, setDeletingManagerId] = useState('');
  const [deletingManager, setDeletingManager] = useState(false);

  // *Navigation to Add manager page
  const handleNavigateToCreateManager = () => {
    router.push({
      pathname: '/admin/users/managers/add',
    });
  }
  // *Navigation to Edit manager page
  const handleNavigateToEditManager = (managerId) => {
    router.push({
      pathname: '/admin/users/managers/edit',
      query: { id: managerId },
    });
  }

  // *Delete/archive Manager
  const handleArchiveManagerModal = (item) => {
    // console.log('route_id', item);
    setConfirmationModalActive(true)
    setDeletingManagerName(item.name);
    setDeletingManagerId(item.id);
  }
  // *Delete/archive Manager by id
  const handleArchiveManagerById = () => {
    setDeletingManager(true);
    // console.log('Deleting', deletingDeliveryExecutiveId);
    apiRequestService.putArchiveManager(deletingManagerId, (responseData) => {
      // console.log("API Repsonse: ", responseData);
      if (responseData?.status) {
        router.reload();
      }
      setDeletingManager(false);
    })
  }


  // Getting all the managers
  useEffect(() => {
    apiRequestService.getAllManagers((responseArray) => {
      // console.log(responseArray);
      setManagers(responseArray);
      setIsloading(false);
    });
  }, []);

  return (
    <SideNavBar>
      <Page title="Managers">
        <Layout>
          <Layout.Section>
            <Banner title="Create manager to manage your order from outside of admin zone." status="info">
              <p>Make sure you know how these changes affect your app.</p>
            </Banner>
          </Layout.Section>
          <Layout.AnnotatedSection
            title="Warehouse Managers"
            description="You can edit and manage all available warehouse managers here"
          >
            <Card>
              <ResourceList
                loading={isloading}
                emptyState={managers.length == 0 && <EmptyResourceList heading="No managers yet" content="Please create one and give warehouse access to manage delivery orders." />}
                resourceName={{ singular: 'manager', plural: 'managers' }}
                items={managers?.map((manager, index) => {
                  return {
                    id: manager._id,
                    name: manager.name,
                    email: manager.email,
                    warehouse_access: manager.warehouse_access.map(
                      (warehouse) => {
                        return ` ${warehouse.title}` + ',';
                      },
                    ),
                  };
                })}
                renderItem={(item) => {
                  const { id, name, email, warehouse_access } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'View',
                        onAction: () => handleNavigateToEditManager(id),
                      },
                      {
                        content: 'Delete',
                        onAction: () => handleArchiveManagerModal(item),
                        destructive: true
                      },
                    ]
                    : null;
                  const media = <Avatar customer size="medium" name={name} />;

                  return (
                    <ResourceItem
                      id={id}
                      media={media}
                      accessibilityLabel={`View details for ${id}`}
                      shortcutActions={shortcutActions}
                      onClick={() => handleNavigateToEditManager(id)}
                    >
                      <h3>
                        <TextStyle variation="strong">{name}</TextStyle>
                      </h3>
                      <div>{email}</div>
                      <div>{warehouse_access}</div>
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
            content: managers.length == 0 ? buttonName.manager.add : buttonName.manager.new,
            onAction: handleNavigateToCreateManager,
          }}
        />
      </Page>
      <ConfirmationModalPopup
        modalActive={confirmationModalActive}
        cloesModalActive={() => setConfirmationModalActive(false)}
        title={'Delete ' + deletingManagerName + '?'}
        btntxt={'Delete'}
        action={handleArchiveManagerById}
        destructive={true}
        subtitle={'Are you sure?'}
        loading={deletingManager} />
    </SideNavBar>
  );
};

Manager.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true;
}

export default Manager;
