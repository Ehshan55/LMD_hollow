import { Badge } from '@shopify/polaris'
import React from 'react'

const Financial = (props) => {
    return (
        <Badge status={props?.order?.financial_status == "pending" && "warning"}
            progress={(props?.order?.financial_status == "pending") ? "incomplete" : (props?.order?.financial_status == "partially_paid") ? "partiallyComplete" : "complete"}>
            {props?.order?.financial_status || '-'}
        </Badge>
    )
}

export default Financial