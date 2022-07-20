import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Banner, Card, Layout, Page, PageActions, ResourceItem, ResourceList, TextStyle } from '@shopify/polaris';
import { useRouter } from 'next/router';

import SideNavBar from '../../../../components/sideNavBar';
import EmptyResourceList from '../../../../components/emptyResourceList';

import { buttonName, pageTitle } from '../../../../utils/hardCoded';

import { validateLogin } from '../../../../contexts/AuthContext';

import AdminApiService from '../../../../apiservices/adminApiService';
import ConfirmationModalPopup from '../../../../components/confirmDeleteModal';
const adminApiRequest = new AdminApiService();


const Agents = () => {
    const router = useRouter();
    const [agents, setAgents] = useState([]);
    const [gettingaAgents, setGettingAgents] = useState(true);

    const [confirmationModalActive, setConfirmationModalActive] = useState(false);
    const [deletingDeliveryExecutiveName, setDeletingDeliveryExecutiveName] = useState('');
    const [deletingDeliveryExecutiveId, setDeletingDeliveryExecutiveId] = useState('');
    const [deletingAgent, setDeletingAgent] = useState(false);

    //* navigating to add Executives
    const handleNavigateToCreateExecutive = () => {
        router.push({
            pathname: '/admin/users/executives/add',
        });
    }
    //* navigating to edit Executives
    const handleNavigateToEditExecutive = (agentId) => {
        router.push({
            pathname: '/admin/users/executives/edit',
            query: { id: agentId },
        });
    }

    // *Delete/archive Delivery Executive
    const handleArchiveExecutiveModal = (item) => {
        // console.log('route_id', item);
        setConfirmationModalActive(true)
        setDeletingDeliveryExecutiveName(item.name);
        setDeletingDeliveryExecutiveId(item.id);
    }
    // *Delete/archive Delivery Executive
    const handleArchiveExecutiveById = () => {
        setDeletingAgent(true);
        // console.log('Deleting', deletingDeliveryExecutiveId);
        adminApiRequest.putArchiveDeliveryExecutive(deletingDeliveryExecutiveId, (responseData) => {
            // console.log("API Repsonse: ", responseData);
            if (responseData?.status) {
                router.reload();
            }
            setDeletingAgent(false);
        })
    }

    //* Getting All Agents Available
    useEffect(() => {
        adminApiRequest.getAllDeliveryAgents((responseArray) => {
            // console.log(responseArray);
            if (responseArray) {
                setAgents(responseArray?.users);
                setGettingAgents(false);
            }
        });
    }, []);


    return (
        <SideNavBar>
            <Page title={pageTitle._Executive}>
                <Layout>
                    <Layout.Section>
                        <Banner title="Create Delivery executives to assign your orders." status="info">
                            <p>Order delivery status can be updated by Admin and Manager as well</p>
                        </Banner>
                    </Layout.Section>
                    <Layout.AnnotatedSection
                        title={pageTitle._executive}
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
                                            {
                                                content: 'Delete',
                                                onAction: () => handleArchiveExecutiveModal(item),
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
                        content: agents.length == 0 ? buttonName.executive.add : buttonName.executive.new,
                        onAction: handleNavigateToCreateExecutive,
                    }}
                />
            </Page>
            <ConfirmationModalPopup
                modalActive={confirmationModalActive}
                cloesModalActive={() => setConfirmationModalActive(false)}
                title={'Delete ' + deletingDeliveryExecutiveName + '?'}
                btntxt={'Delete'}
                action={handleArchiveExecutiveById}
                destructive={true}
                subtitle={'Are you sure?'}
                loading={deletingAgent} />
        </SideNavBar>
    );
};

Agents.getInitialProps = async (ctx) => {
    validateLogin(ctx);
    return true
}

export default Agents;
