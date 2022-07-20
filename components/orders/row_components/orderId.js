import { Button, Link } from "@shopify/polaris"
import { useEffect } from "react"

const OrderId = (props) => {
    useEffect(() => {
        console.log('props.allOrderIds', props.allOrderIds)
    }, [])

    return (
        <Link onClick={(e) => e.stopPropagation()} monochrome external url={"/order-details/" + props?.order?._id}>{props?.order?.name}</Link>
    )
}

export default OrderId