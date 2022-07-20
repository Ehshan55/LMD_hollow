import { Button, Card, DisplayText, Layout, ResourceItem, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import React, { useContext, useEffect, useState } from 'react';

import EmptyResourceList from '../../components/emptyResourceList';

import { DataContext } from '../../contexts/DataContext';


import adminApiService from '../../apiservices/adminApiService';
const apiRequestService = new adminApiService();

const WarehouseZoneInfo = (props) => {
    const { warehouseData } = useContext(DataContext);
    const [zones, setZones] = useState([]);
    const [isloading, setIsloading] = useState(true);


    //* Getting warehouse zones
    useEffect(() => {

        if (warehouseData._id) {
            apiRequestService.getDeliveryZonesByWarehouseId(warehouseData._id, (responseArray) => {
                // console.log(responseArray);
                if (responseArray) {
                    setZones(responseArray);
                    setIsloading(false);
                }
            });
        }
    }, []);
    return (
        <div className={"onboardingDiv"}>

            <div className="onboarding_firsthalf">
                <div className="mediaCard">
                    <div className="mediaCardImageHolder">
                        <div className="content_firsthalf">
                            <DisplayText size="extraLarge">Warehouse and it's Zone</DisplayText><br />
                            <DisplayText size="large">You can edit and manage all available warehouse zones </DisplayText>
                            <DisplayText size="large"> from admin's panel.</DisplayText>

                            <img className="helper_img" src="/images/wizard/4.png" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="onboarding_secondhalf">
                <div className="content_secondhalf">
                    <DisplayText size="large">Created warehouse-zone</DisplayText><br />
                    <Card sectioned >
                        <ResourceList
                            items={[
                                {
                                    id: warehouseData?._id,
                                    name: warehouseData?.title,
                                    location: warehouseData?.address?.city,
                                    state: warehouseData?.address?.state,
                                },
                            ]}
                            renderItem={(item) => {
                                const { id, name, location, state } = item;
                                const media = <Thumbnail size="large" source="/images/InventoryMajor.svg" alt="Warehouse" />;

                                return (
                                    <ResourceItem
                                        id={id}
                                        media={media}
                                        accessibilityLabel={`View details for ${name}`}
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


                        <Card.Section>
                            <ResourceList
                                loading={isloading}
                                emptyState={zones?.length == 0 && <EmptyResourceList heading="No zones associated yet with this warehouse" content="Please create one with area pin codes for order syncing." />}
                                items={zones?.map((zone, index) => {
                                    return {
                                        id: zone._id,
                                        name: zone.title,
                                        location: zone.address?.city,
                                        state: zone.address?.state,
                                    };
                                })}
                                renderItem={(item) => {
                                    const { id, name, location, state } = item;
                                    const media = <Thumbnail size="small" source="/images/LocationMajor.svg" alt="Warehouse" />;

                                    return (
                                        <ResourceItem
                                            id={id}
                                            media={media}
                                            accessibilityLabel={`View details for ${name}`}
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
                        </Card.Section>
                    </Card><br />
                    <Stack alignment="center" distribution="trailing">
                        <Button primary onClick={() => props.setPageCase(4)}>
                            Next
                        </Button>
                    </Stack>
                </div>
            </div>

        </div>

    )
}

export default WarehouseZoneInfo