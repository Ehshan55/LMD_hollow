export function badgeStatus (status){
    if (status == 'new' || status == '' || status == 'on_the_way' || status == 'picked_up' || status == 'out_for_delivery') {
        return ('info')
    } else if (status == 'reschedule' || status == 'Unfulfilled') {
        return ('warning')
    } else if (status == 'canceled') {
        return ('warning');
    } else if (status == 'delivered') {
        return ('success');
    }
}

export function badgeProgress (progress){
    if (progress == 'new' || progress == ''  || progress == 'Unfulfilled') {
        return ('incomplete')
    } else if (progress == 'on_the_way' || progress == 'picked_up'|| progress == 'out_for_delivery' || progress == 'reschedule') {
        return ('partiallyComplete')
    } else if (progress == 'canceled' || progress == 'delivered') {
        return ('complete');
    }
}