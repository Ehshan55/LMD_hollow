
const makeAddressString = (address) => {
    let addStr = address?.address1 + ', ' + address?.address2 + ', ' +
        address?.city + ', ' + address?.province + ', ' +
        address?.zip + ', ' + address?.country
    return (addStr);
}

export default makeAddressString