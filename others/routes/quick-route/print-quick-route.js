import { Badge, Card, Frame, Heading, IndexTable, Page, Stack, Subheading, TextStyle, TopBar } from "@shopify/polaris";
import { PrintMinor } from "@shopify/polaris-icons";

import { Fragment, useContext, useEffect, useState } from "react";
import AdminApiService from "../../../../apiservices/adminApiService";
import LoaderContext from "../../../../contexts/LoaderContext";
import { badgeProgress, badgeStatus } from "../../../../utils/customBadge";
import { remove_ } from "../../../../utils/textFormate";

const adminApiRequestService = new AdminApiService();
const PrintQuickRoute = () => {
    const { showLoader } = useContext(LoaderContext);
    const [routeDataForPrinting, setRouteDataForPrinting] = useState();

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const rowMarkup = routeDataForPrinting?.orders?.map(
        (item, index) => (
            <IndexTable.Row id={index} key={index} position={index}>
                <IndexTable.Cell>{index + 1}</IndexTable.Cell>
                <IndexTable.Cell> <TextStyle variation="strong">{item?.name}</TextStyle> </IndexTable.Cell>
                <IndexTable.Cell>{item?.shipping_address?.first_name}{' '}{item?.shipping_address?.last_name}</IndexTable.Cell>
                <IndexTable.Cell>{item?.shipping_address?.address1}{item?.shipping_address?.address2}</IndexTable.Cell>
                <IndexTable.Cell>{(item?.shipping_address?.phone) || (item?.billing_address?.phone) || (item?.phone)}</IndexTable.Cell>
                <IndexTable.Cell><Badge status={badgeStatus(item?.delivery_status)} progress={badgeProgress(item?.delivery_status)}> {remove_(item?.delivery_status, true)} </Badge></IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    useEffect(() => {
        showLoader(true);
        const params = new URLSearchParams(window.location.search);
        let route_id = '';
        if (params.has('routeId')) {
            route_id = params.get('routeId');
            adminApiRequestService.getQuickMapRouteByRouteId(route_id, (responseData) => {
                if (responseData) {
                    // console.log(responseData);
                    if (responseData[0]?.orders) {
                        let routeData = responseData[0];
                        setRouteDataForPrinting(routeData);
                        showLoader(false);
                        window.print();
                        // window.onfocus = function () {
                        //     window.close();
                        // }
                    }
                    else {
                        showLoader(false);
                        // console.log("No orders found");
                    }
                }
                else {
                    showLoader(false);
                    // console.log("No orders found");
                }
            })
        }
    }, [])
    return (
        <Fragment>
            {/* <style jsx>{`
                   @media print {
                    body {transform: scale(.8);}
                    table {page-break-inside: avoid;}
                    size: A3;
                }
                `}</style> */}
            <TopBar style={{ background: "transparent" }} />
            {routeDataForPrinting?.orders?.length ? <Page title="Delivery Map Route"
                secondaryActions={[{ content: 'Print', size: "slim", icon: PrintMinor, onAction: () => window.print() }]}
                fullWidth>

                <br />
                <Stack distribution="fill">
                    <Stack.Item>
                        <Subheading>Route name: </Subheading>
                        <Heading> {routeDataForPrinting?.title}</Heading>
                    </Stack.Item>
                    <Stack.Item>
                        <Subheading>Assigned Delivery executive: </Subheading>
                        <Heading> {routeDataForPrinting?.owner_user_ref?.name}{' | '}{routeDataForPrinting?.owner_user_ref?.email}</Heading>
                    </Stack.Item>

                </Stack>
                <br />
                <Card>
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={routeDataForPrinting?.orders?.length}
                        headings={[
                            { title: 'Index' },
                            { title: '# Order' },
                            { title: 'Customer Name' },
                            { title: 'Delivery Address' },
                            { title: 'Phone No.' },
                            { title: 'Delivery Status' },
                        ]}
                        selectable={false}
                    >
                        {rowMarkup}
                    </IndexTable>
                </Card>
            </Page> : <div style={{ textAlign: 'center', padding: '20%', }}>Could not fetch route details. Please try again.</div>}
        </Fragment>
    )
}

export default PrintQuickRoute