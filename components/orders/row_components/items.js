import { Button, Icon, Link, Popover } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import {
    ConversationMinor, DropdownMinor
} from '@shopify/polaris-icons';

const Items = (props) => {
    const [popoverActive, setPopoverActive] = useState(false);

    const [orderedProducts, setOrderedProducts] = useState(props?.order?.line_items);
    const togglePopoverActive = () => { setPopoverActive((popoverActive) => !popoverActive); }

    // useEffect(() => {
    //     console.log(props.order)
    // }, [])
    return (<div onMouseLeave={() => { if (popoverActive) { setPopoverActive(false) } }}>
        <Popover
            fluidContent
            preventFocusOnClose
            active={popoverActive}
            activator={
                <Link monochrome
                    removeUnderline
                    onClick={(event) => { event.stopPropagation(); togglePopoverActive(); }}
                >
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        {orderedProducts?.length}
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
            </Popover.Pane>
            {orderedProducts?.length && orderedProducts.map((lineItem, index) => {
                return (<Popover.Pane key={index} fixed>
                    <Popover.Section>
                        <div>
                            <Link external
                                url={"https://" + props?.order.store_url + "/admin/products/" + lineItem.product_id + "/variants/" + lineItem.variant_id}>
                                <b>{lineItem.title}</b>
                            </Link>
                            {lineItem.quantity > 1 && <span> x {lineItem.quantity}</span>}
                        </div>
                        <p>{lineItem.variant_title}</p>

                        {/* https://fashion-atom.myshopify.com/admin/products/7086610022586/variants/41411763077306 */}
                        {/* <p><Link url={"tel:" + props?.order?.customer?.phone} external>{props?.order?.customer?.phone}</Link></p>
                    <p><Link url={"mailto:" + props?.order?.customer?.email} external>{props?.order?.customer?.email}</Link></p> */}
                    </Popover.Section>
                </Popover.Pane>)
            })}
            {/* <Popover.Pane>
                <Popover.Section>
                    <Button>View Items</Button>
                </Popover.Section>
            </Popover.Pane> */}
        </Popover>
    </div>
    )
}

export default Items