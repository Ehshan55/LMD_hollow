
const removeDublicateOrders = (available_orders) => {
    let all_orders = available_orders;
    for (let i = 0; i < all_orders.length; i++) {
        for (let j = i + 1; j < all_orders.length; j++) {
            if (all_orders[i]._id == all_orders[j]._id) {
                // console.log('dublivate', all_orders[i])
                all_orders.splice(j, 1);
            }
        }

    }
    return (all_orders);

}

export default removeDublicateOrders