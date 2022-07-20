import { Badge } from '@shopify/polaris'
import React from 'react'

const Fulfillment = (props) => {
    return (
        <Badge status={!props?.order?.fulfillment_status && "attention"}
            progress={(!props?.order?.fulfillment_status) ? "incomplete" : (props?.order?.fulfillment_status == "partially_fuilfilled") ? "partiallyComplete" : "complete"}>
            {props?.order?.fulfillment_status || 'Unfulfilled'}
        </Badge>
    )
}

export default Fulfillment