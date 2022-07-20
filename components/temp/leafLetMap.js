
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
// import L from 'leaflet';

// const position = [[51.505, -0.09], [51.500, -0.09], [51.510, -0.09]];
// const iconPerson = new L.Icon({
//     iconUrl: '../images/marker-icon.png',
//     iconRetinaUrl: '../images/marker-icon.png',
//     iconAnchor: [25, zoom > 15 ? 50 : 68 + defaultZoom - 13],
//     popupAnchor: [14, 0],
//     shadowUrl: null,
//     shadowSize: null,
//     shadowAnchor: null,
//     iconSize: [50, 50],
//     className: 'leaflet-marker-icon leaflet-zoom-animated leaflet-interactive'
// });
const LeafLetMap = () => {

    return (

        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
            <Marker position={[51.505, -0.09]} draggable={true}
                animate={true}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {/* {position.map((point) => {
                    return (<Marker icon={iconPerson} position={point}>
                        <Popup>
                            {point[0]}, {point[1]}.
                        </Popup>
                    </Marker>)
                })} */}
        </MapContainer>

    )

}

export default LeafLetMap