import { Button, Icon, Link, Popover } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import {
    ConversationMinor, DropdownMinor
} from '@shopify/polaris-icons';

const Customer = (props) => {
    const [popoverActive, setPopoverActive] = useState(false);

    const [shippingAddress, setShippingAddress] = useState(props?.order?.shipping_address);
    const [customer, setCustomer] = useState(props?.order?.customer);
    const togglePopoverActive = (event) => { setPopoverActive((popoverActive) => !popoverActive); }

    useEffect(() => {
        // console.log(props.order)
    }, [])
    return (<div onMouseLeave={() => { if (popoverActive) { setPopoverActive(false) } }}>
        <Popover
            fluidContent
            preventFocusOnClose
            active={popoverActive}
            activator={
                <Link monochrome
                    removeUnderline
                    onClick={(event) => { event.stopPropagation(); togglePopoverActive(event); }}
                >
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        {shippingAddress?.name}
                        <Icon
                            source={DropdownMinor}
                            color="base" />
                    </div>
                </Link>
            }
            autofocusTarget="first-node"
            onClose={togglePopoverActive}
        >
            <Popover.Pane fixed>
                <Popover.Section>
                    <b>Ship to</b>
                    <p>{shippingAddress?.name}</p>
                    <p>{shippingAddress?.phone}</p>
                    <p>{shippingAddress?.email}</p>
                </Popover.Section>
            </Popover.Pane>
            <Popover.Pane fixed>
                <Popover.Section>
                    <b>Customer</b>
                    <p>{customer?.first_name}{' '}{customer?.last_name}</p>
                    <p><Link url={"tel:" + customer?.phone} external>{customer?.phone}</Link> <Link url={"sms:" + customer?.phone} external>
                        {/* <Icon
                        source={ConversationMinor}
                        color="base" /> */}
                    </Link>
                    </p>
                    <p><Link url={"mailto:" + customer?.email} external>{customer?.email}</Link></p>
                </Popover.Section>
            </Popover.Pane>
            <Popover.Pane>
                <Popover.Section>
                    <Button external url={"https://" + props?.order.store_url + "/admin/customers/" + customer?.id}>View Customer</Button>
                </Popover.Section>
            </Popover.Pane>
        </Popover>
    </div>
    )
}

export default Customer