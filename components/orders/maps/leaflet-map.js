import { useState, useEffect, useContext, useCallback, Fragment } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap, Popup, Tooltip } from 'react-leaflet';
import { icon, latLngBounds } from "leaflet"
import { DataContext } from '../../../contexts/DataContext';
import Legend from './map_legends';
import { Link } from '@shopify/polaris';

export function ChangeView({ center, bounds }) {
  const map = useMap();
  map.fitBounds(bounds);
  if (center.length) {
    map.setView(center, 8)
  }
  // map.setZoom(8)
  return (<Legend map={map} />);
}

const ICON = icon({
  iconUrl: "/images/marker-icon.png",
  iconAnchor: [15, 15],
  iconSize: [30, 22], //[30, 45] calculated value use if want to show the marker
  // popupAnchor: [0, -25],
})

export default function MapLeaflet() {

  const { orderResponse, selectedOrdersIds } = useContext(DataContext);
  const [inActiveOrders, setInActiveOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const [center, setCenter] = useState([]);
  const [MapBounds, setMapBounds] = useState([]);
  const [bounds, setBounds] = useState([]);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    let inactive_orders = [];
    let active_orders = [];
    let mapBounds = [];
    orderResponse.forEach((order) => {
      if (order.location) {
        let latlng = [parseFloat(order.location.lat), parseFloat(order.location.lng)];
        let orderLocationObj = {
          coords: latlng,
          address: order.location.title,
          id: order._id,
          label: order.name,
          active: (selectedOrdersIds.includes(order._id))
        }
        if (selectedOrdersIds.includes(order._id)) {
          active_orders.push(orderLocationObj);
        } else {
          inactive_orders.push(orderLocationObj);
        }
        mapBounds.push(latlng)
      }
    })
    if (inactive_orders.length || active_orders.length) {
      setInActiveOrders(inactive_orders);
      setActiveOrders(active_orders)
      setMapBounds(mapBounds)
    }
    else {
      setInActiveOrders([]);
      setActiveOrders([])
    }

    // console.log('inactive_orders', inactive_orders)
  }, [orderResponse, selectedOrdersIds])

  useEffect(() => {
    if (activeOrders.length > 0) {
      setCenter(activeOrders[activeOrders.length - 1].coords);
    } else if (inActiveOrders.length > 0) {
      setCenter(inActiveOrders[0].coords);
    }
    if (MapBounds.length > 0) {
      let mapBounds = latLngBounds(MapBounds);
      setBounds(mapBounds)
    }
  }, [activeOrders, inActiveOrders, MapBounds])

  return (<Fragment>{orderResponse.length > 0 && center.length > 0 &&
    <MapContainer center={center} zoom={zoom}>

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {inActiveOrders.map((order, i) => {
        return (<Marker key={i}
          position={order.coords}
          draggable={false}
          icon={ICON}
          animate={true} >
          <Tooltip direction="top" offset={[0, 5]} opacity={1} permanent >
            <Popup> <Link external url={"/order-details/" + order?.id}> {order.label}</Link>{" "}{order.address}</Popup>
            {order.label}
          </Tooltip>
        </Marker>)
      })}

      {activeOrders.map((order, i) => {
        return (<Marker key={i} position={order.coords} icon={ICON} animate={true} >
          <Tooltip className="active" direction="top" offset={[0, 5]} opacity={1} permanent >
            <Popup> <Link external url={"/order-details/" + order?.id}> {order.label}</Link>{" "}{order.address}</Popup>
            {order.label}
          </Tooltip>
        </Marker>)
      })}
      {/* <ChangeView center={center} bounds={bounds} /> */}

    </MapContainer>}
  </Fragment>);
}
