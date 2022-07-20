import React, { useCallback, useState, useEffect, useContext } from "react";
import { Context } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";
import { Redirect } from "@shopify/app-bridge/actions";
import { Button, Heading, } from "@shopify/polaris";


function PlanUpgradePopup(props) {


    return (
        <div>
            <style jsx>{`
          .popupContainer {
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            left: 0%;
            top: 0%;
            height: 100%;
            width: 100%;
          }

          .popup {
            width: 500px;
            height: auto;
            background: #ffffff;
            margin-left: auto;
            margin-right: auto;
            margin-top: 20%;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 30px;
            padding-right: 30px;
          }

          .buttonGroup {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          }

          @media only screen and (max-width: 768px) {
            /* For mobile phones: */
            .customCards {
              width: 48%;
              margin: 5px;
              color: #5c5f62;
            }

            .selectDropdowns {
              width: 75%;
            }

            .popup {
              width: 75%;
            }

            .buttonGroup {
              flex-direction: column;
            }
          }
        `}</style>
            <div className="popupContainer">
                <div className="popup">
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <img
                            src="images/customer-review.svg"
                            style={{
                                height: "50px",
                                width: "50px",
                            }}
                        />
                        <br></br>
                        <br></br>
                        <Heading>You can use Review Ticker for FREE</Heading>
                        <br></br>
                        <p>
                            You don't have to choose a plam untill you have a live store
                            (free for all dev store)
                        </p>
                        <br></br>
                        <div className="buttonGroup">
                            <div style={{ marginBottom: "10px" }}>
                                <div
                                    style={{
                                        padding: "8px",
                                        width: "100%",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        color: "#008060",
                                        textAlign: "center",
                                        border: "1px solid #008060",
                                        fontWeight: "500",
                                    }}
                                    onClick={props.currentPageChange}
                                >
                                    Try either plan free for 15 days
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <Button primary onClick={props.currentPageChange}>
                                    Try free for 15 days
                                </Button>
                            </div>
                        </div>
                    </div>

                    <br></br>
                </div>
            </div>
        </div>
    );
}

export default PlanUpgradePopup;

