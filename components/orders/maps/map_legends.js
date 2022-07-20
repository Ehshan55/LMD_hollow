import { useEffect } from "react";
import L from "leaflet";

function Legend(props) {
    // console.log(props.map);
    useEffect(() => {
        if (props.map) {
            const legend = L.control({ position: "bottomleft" });
            // if (!legend.options.position) {
            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info legend");
                div.innerHTML += '<div><p class="ledged-item"><i style="background: #008060; "></i>Selected</p>';
                div.innerHTML += '<p class="ledged-item" ><i style="background: #393838 !important"></i>Non-selected</p><br></div>';
                return div;
            };

            legend.addTo(props.map);
            // }
        }
    }, [props.map]);
    return null;
}

export default Legend;