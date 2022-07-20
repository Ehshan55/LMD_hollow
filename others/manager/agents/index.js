import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';

import EmptyResourceList from '../../../components/emptyResourceList';

import { validateLogin } from '../../../contexts/AuthContext';

import ManagerApiService from '../../../apiservices/managerApiService';
import Router from 'next/router';
import SideNavBarManager from '../../../components/sideNavBarManager';
const apiRequest = new ManagerApiService();


const Agents = () => {

  const [agents, setAgents] = useState([]);
  const [gettingaAgents, setGettingAgents] = useState(true);

  //* navigating to add Executives
  const handleNavigateToCreateExecutive = () => {
    Router.push({
      pathname: '/manager/agents/add',
    });
  }
  //* navigating to edit Executives
  const handleNavigateToEditExecutive = (agentId) => {
    Router.push({
      pathname: '/manager/agents/edit',
      query: { id: agentId },
    });
  }

  //* Getting All Agents Available
  useEffect(() => {
    apiRequest.getAllDeliveryAgents('', '', (responseArray) => {
      // console.log(responseArray);
      if (responseArray) {
        setAgents(responseArray?.users);
        // setItemsArray(responseArray)
        setGettingAgents(false);
      }
    });
  }, []);


  return (
    <SideNavBarManager>
      <Page title="Agents">
        <Layout>
          <Layout.Section>
            <Banner title="Create Delivery executives to assign your orders." status="info">
              <p>Order delivery status can be updated by Admin and Manager as well</p>
            </Banner>
          </Layout.Section>
          <Layout.AnnotatedSection
            title="Delivery Executives"
            description="You can edit and manage all available delivery executives here"
          >
            <Card>
              <ResourceList
                emptyState={agents.length == 0 && <EmptyResourceList heading="No delivery agents yet" content="Please create one to assign order delivery task." />}
                loading={gettingaAgents}
                resourceName={{ singular: 'agent', plural: 'agents' }}
                items={agents?.map((agent, index) => {
                  return {
                    id: agent._id,
                    name: agent.name,
                    email: agent.email,
                    zone_access: agent.delivery_zone_access.map((zone) => {
                      return ` ${zone}` + ',';
                    }),
                  };
                })}
                renderItem={(item) => {
                  const { id, name, email, warehouse_access } = item;
                  const shortcutActions = id
                    ? [
                      {
                        content: 'View',
                        onAction: () => handleNavigateToEditExecutive(id),
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
                      onClick={() => handleNavigateToEditExecutive(id)}
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
            content: 'Create Delivery Agent',
            onAction: handleNavigateToCreateExecutive,
          }}
        />
      </Page>
    </SideNavBarManager>
  );
};

Agents.getInitialProps = async (ctx) => {
  validateLogin(ctx);
  return true
}

export default Agents;
