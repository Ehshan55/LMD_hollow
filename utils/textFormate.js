function uppercase(str) {
    return `${str?.charAt(0)?.toUpperCase() + str?.slice(1)}`;
}

function toTitleCase(str) {
    return str.replace(
        /\b\w+/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function remove_(str, opt) {

    if (opt) {
        if (str == 'new') {
            return "New";
        }
        else if (str == 'on_the_way') {
            return "On The Way";
        } else if (str == 'picked_up') {
            return "Picked Up";
        } else if (str == 'out_for_delivery') {
            return "Out For Delivery";
        } else if (str == 'reschedule') {
            return " Reschedule";
        } else if (str == 'canceled') {
            return " Canceled";
        } else if (str == 'delivered') {
            return " Delivered";
        }
    }
    else {
        if (str == 'new') {
            return "Order Placed";
        }
        else if (str == 'on_the_way') {
            return "Order is On The Way";
        } else if (str == 'picked_up') {
            return "Order is Picked Up";
        } else if (str == 'out_for_delivery') {
            return "Order is Out For Delivery";
        } else if (str == 'reschedule') {
            return "Order Reschedule";
        } else if (str == 'canceled') {
            return "Order Canceled";
        } else if (str == 'delivered') {
            return "Order Delivered";
        }

        else if (str == 'order_name') {
            return "order name";
        }
        else if (str == 'order_id') {
            return "order id";
        }
        else if (str == 'zone_name') {
            return "zone name";
        }
        else if (str == 'order_tags') {
            return "tag";
        }
    }
}

function formatStatusTxt(str) {

    if (str == 'new') {
        return "New";
    }
    else if (str == 'on_the_way') {
        return "On The Way";
    } else if (str == 'picked_up') {
        return "Picked Up";
    } else if (str == 'out_for_delivery') {
        return "Out For Delivery";
    } else if (str == 'reschedule') {
        return "Reschedule";
    } else if (str == 'canceled') {
        return "Canceled";
    } else if (str == 'delivered') {
        return "Delivered";
    }

}


export { uppercase, toTitleCase, remove_, formatStatusTxt };