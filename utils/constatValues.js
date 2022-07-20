let PAGE_ROUTES_CONSTANT = {
    WAREHOUSE: {
        HOME: "",
    },
    ZONES: {
        NEW_ZONES: 'Create New Warehouse',
        EDIT_ZONES: ''
    }

}

const FILTERCONFIG = {
    durationValues: [
        { value: 'c', label: 'Last 30 Mins', disabled: false },
        { value: 'h', label: 'Last 1 Hr', disabled: false },
        { value: 'd', label: 'Last 24 Hrs' },
        { value: 'w', label: 'Last 7 Days' },
        { value: 'm', label: 'Last 30 Days' },
        { value: 'z', label: 'Custom', data: { gte: "", lte: "" }, disabled: true },
    ],
    // responsible for table headers
    column: {
        name: {
            label: "Order",
            display_key: "name",
            disabled: true,
            component: "orderId"
        },
        shipping_address: {
            label: "Address",
            display_key: "shipping_address.address1",
            disabled: true,
        },
        location: {
            label: "Location",
            display_key: "location.title",
            component: "location"
        },
        city: {
            label: "City",
            display_key: "shipping_address.city"
        },
        zip: {
            label: "Zip Code",
            display_key: "shipping_address.zip"
        },
        customer: {
            label: "Customer",
            display_key: "shipping_address.name",
            component: "customer"
        },
        total_price_usd: {
            label: "Price",
            display_key: "total_price_usd"
        },
        financial_status: {
            label: "Payment",
            display_key: "financial_status",
            component: "financial"
        },
        fulfillment_status: {
            label: "Fulfillments",
            display_key: "fulfillment_status",
            component: "fulfillment"
        },
        line_items: {
            label: "Items",
            display_key: "line_items",
            component: "items"
        },

    },
    columns: [
        {
            "value": "fulfillments",
            "label": "Fulfillments",
        },
        {
            "value": "refunds",
            "label": "Refunds"
        },
        {
            "value": "delivery_status",
            "label": "Delivery Status"
        },
        {
            "value": "is_assigned",
            "label": "Is Assigned"
        },
        {
            "value": "name",
            "label": "Order"
        },
        {
            "value": "note",
            "label": "Note"
        },
        {
            "value": "order_number",
            "label": "Order Number"
        },
        {
            "value": "tags",
            "label": "Tags"
        },
        {
            "value": "customer.first_name",
            "label": "Customer"
        },
        {
            "value": "shipping_address",
            "label": "Shipping Address"
        },
        {
            "value": "delivery_notes",
            "label": "Delivery Notes"
        },
        {
            "value": "createdAt",
            "label": "Created At"
        },
        {
            "value": "assigned_to",
            "label": "Assigned To"
        }
    ],
    sortBy: [
        {
            "value": "name",
            "label": "Order Name"
        },
        {
            "value": "createdAt",
            "label": "Created At"
        },
        {
            "value": "customer",
            "label": "Customer"
        },
        {
            "value": "fulfillments",
            "label": "Fulfillment"
        },
        {
            "value": "assigned_to",
            "label": "Assigned To"
        },
    ],
    filters: {
        name: {
            label: "Name",
            values: [
                { "$regex": "#106" },
            ],
            fieldType: "text"
        },
        assignment: {
            label: "Assignment",
            values: [
                { label: 'Assigned', value: 'assigned' },
                { label: 'Unassigned', value: 'unassigned' }
            ],
            allowMultiple: false,
            autoComplete: false,
            fieldType: "select"
        },
        zone: {
            label: "Zone",
            values: [
                { label: 'Zone1', value: 'zone1' },
                { label: 'Zone2', value: 'zone2' },
                { label: 'Zone3', value: 'zone3' },
            ],
            allowMultiple: true,
            autoComplete: {
                api: "/filters/zone",
                searchTerm: "zone1",
                results: [],
            },
            fieldType: "select"
        }
    }
}


const RULES_FIELD_OPTIONS = [
    { value: 'zip', label: 'Address Pincode' },
    { value: 'tags', label: 'Order tags' },
    { value: 'city', label: 'City' },
    { value: 'country', label: 'Country' },
    { value: 'distance', label: 'Distance Range' },
    { value: 'downtown', label: 'Area (Address line one)' },
]




module.exports = {
    PAGE_ROUTES_CONSTANT,
    FILTERCONFIG: FILTERCONFIG,
    RULES_FIELD_OPTIONS,
}