import React, { useCallback, useState, useEffect, useContext } from "react";
class Crisp extends React.Component {
    componentDidMount() {
        // Include the Crisp code here, without the <script></script> tags
        window.$crisp = [];
        window.CRISP_WEBSITE_ID = "7ee8e42e-3540-45f3-ad63-1a3714f91310";
        (() => {
            const d = document;
            const s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("body")[0].appendChild(s);
          })();

    }

    render() {
        return null;
    }
}
export default Crisp

