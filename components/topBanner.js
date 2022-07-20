import React, { Fragment } from 'react';
import { Banner } from '@shopify/polaris';

function TopBanner(props) {

    const rename = (name, value) => {
        if (value == 'on_the_way') {
            return ('On The Way');
        }
        else {
            return (name);
        }
    }


    // const handelOnClick = (status) => {
    //     props.handelFilterByStatus(status);
    // }


    return (
        <Fragment>
            <style jsx>{`
            .banner:hover{
                cursor: pointer;
            }
            .banner{
                width: 25%;
                display: inline-block;
                padding: 5px;
            }
          
            @media screen and (max-width: 1142px) {
                .banner {
                    width: 50%;
                }
             }
             @media screen and (max-width: 430px) {
                .banner {
                    width: 100%;
                }
             }
            `}</style>


            <div className="banner" onClick={() => handelOnClick('all')}>
                <Banner title="All" status="info">
                    <p>#{props.orderCount?.all?.count || 10}</p>
                </Banner>
            </div>


            <div className="banner" onClick={() => handelOnClick('new')}>
                <Banner title="New" status="info">
                    <p>#{props.orderCount?.new?.count || 3}</p>
                </Banner>
            </div>

            {/* {props.orderCount?.active_delivery_status?.map((status, index) => (
                <div tabIndex={index} className="banner" key={status.val} onClick={() => handelOnClick(status.val)}>
                    <Banner key={status.val} title={rename(status.name, status.val)} status="info">
                        <p>#{
                            status.val == "on_the_way" ? props.orderCount.on_the_way.count :
                                status.val == "picked_up" ? props.orderCount.picked_up.count :
                                    status.val == "out_for_delivery" ? props.orderCount.out_for_delivery.count :
                                        status.val == "reschedule" ? props.orderCount.reschedule.count :
                                            status.val == "delivered" ? props.orderCount.delivered.count :
                                                status.val == "canceled" ? props.orderCount.canceled.count :
                                                    ""
                        }</p>
                    </Banner>
                </div>
            ))} */}



            <br />
        </Fragment>
    );
}

export default TopBanner;