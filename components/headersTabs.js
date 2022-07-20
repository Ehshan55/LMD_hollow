import React, { useCallback, useState, useEffect, useContext } from "react";
import { Card, Image, Tabs, TopBar } from "@shopify/polaris";
import { useRouter } from "next/router";
import { Context } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

function HeaderTabs(props) {
  const [activeHeader, setActiveHeader] = useState(
    props.activeHeader ? props.activeHeader : ""
  );
  const [selected, setSelected] = useState(undefined);
  const router = useRouter();

  // const appBridgeContext = useContext(Context);
  // const redirect = Redirect.create(appBridgeContext);

  // const tabs = [
  //   {
  //     id: "dashboard",
  //     content: "Settings",
  //     // accessibilityLabel: 'All customers',
  //     panelID: "dashboard",
  //     url: "/",
  //   },
  //   {
  //     id: "engagement-metrics",
  //     content: "Engagement Metrics",
  //     panelID: "engagement-metrics",
  //     url: "/engagement-metrics",
  //   },
  //   {
  //     id: "configuration",
  //     content: "Review app integration",
  //     panelID: "configuration",
  //     url: "/configuration",
  //   },
  //   {
  //     id: "themes",
  //     content: "Theme Configuration",
  //     panelID: "themes",
  //     url: "/themes",
  //   },

  //   {
  //     id: "plans",
  //     content: "Plans",
  //     panelID: "plans",
  //     url: "/plans",
  //   },
  // ];

  useEffect(() => {
    // let tabObj = tabs.find(element => element.id == activeHeader);
    // let tabIndex = tabs.findIndex((element) => element.id == activeHeader);
    // console.log("Selecter header index : ", tabIndex);
    // if (tabIndex != -1) {
    //   setSelected(tabIndex);
    // }
  }, []);

  const handleTabChange = (value) => {
    setSelected(value);
    let selectedObj = tabs[value];
    if (selectedObj.url) {
      // router.push(selectedObj.url);
      // redirect.dispatch(Redirect.Action.APP, selectedObj.url);
    }
  };

  return (
    <>
      <style jsx>{`
        .headerSticky {
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: 0;
          z-index: 1000;
          // margin-left: -5px !important;
          // margin-right: -5px !important;
        }
        .logoPadding {
          padding: 12px 10px 5px 20px;
        }
        .noRadius {
          border-radius: 0px;
        }
      `}</style>

      <div className="headerSticky">
        <Card className="noRadius logoPadding">
          <Image src='/images/logo.png' width='200px' />
          {/* <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={(val) => handleTabChange(val)}
          ></Tabs> */}
        </Card>
      </div>
    </>
  );
}

export default HeaderTabs;
