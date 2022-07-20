import { Icon, Thumbnail } from "@shopify/polaris";
import { useState } from "react"

const Location = (props) => {
    const [location, setLocation] = useState(props.order.location);
    return (
        <div>{location ? location.title : ''}</div>
    )
}

export default Location