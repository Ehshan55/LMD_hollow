
import React, { useEffect, useState } from "react";
import {
    withGoogleMap,
    GoogleMap,
    Marker,
    withScriptjs,
    DirectionsRenderer
} from "react-google-maps";
import { createLatLngObject } from "../utils/helper";


const Markers = (props) => {
    let delayFactor = 0;

    const [directions, setDirections] = useState();

    /**
     * Google Maps Direction Service
     * @param {startLoc coordinates} startLoc 
     * @param {destinationLoc coordinates} destinationLoc 
     * @param {checkpoints coordinates} wayPoints 
     */
    const getDirections = (startLoc, destinationLoc, wayPoints) => {

        const waypts = [];
        if (wayPoints.length > 0) {
            wayPoints.forEach(wayPoint => {
                let wpo = createLatLngObject(wayPoint);
                // console.log("wayyy", wpo)
                waypts.push({
                    location: new window.google.maps.LatLng(wpo),
                    stopover: true
                });
            })
        }
        // console.log('___', wayPoints);
        const directionService = new window.google.maps.DirectionsService();
        directionService.route(
            {
                origin: startLoc,
                destination: destinationLoc,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                // console.log("status", status, result);
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    let waypts = result.routes[0].overview_path.filter((elem, index) => {
                        return index % 30 === 0;
                    })
                    // console.log('>>>', waypts)

                } else if (status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                    delayFactor += 0.2;
                    // if (this.delayFactor <= 10) this.delayFactor = 0.2;
                    setTimeout(() => {
                        getDirections(startLoc, destinationLoc, wayPoints);
                    }, delayFactor * 200);
                } else { console.error(`error fetching directions `, result); }
            }
        );
    }

    useEffect(() => {
        getDirections(props.startLoc, props.destinationLoc, props.wayPoints);
        // console.log(props.startLoc, props.destinationLoc, props.wayPoints);
    }, [props.orders, props.wayPoints])

    return (
        <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
            {props.wayPoints && props.wayPoints.map((place, index) => {
                return (
                    <Marker
                        label={`${index + 2}`}
                        key={index}
                        position={createLatLngObject(place)}
                    />
                );
            })}

            {(props.startLoc) &&
                <Marker
                    label={'1'}
                    defaultIcon={null}
                    position={createLatLngObject(props.startLoc)}
                />
            }
            {(props.destinationLoc) &&
                <Marker
                    label={`${props.orders.length}`}
                    defaultIcon={null}
                    position={createLatLngObject(props.destinationLoc)}
                />
            }

            <DirectionsRenderer
                directions={directions}
                options={{
                    polylineOptions: {
                        storkeColor: "#2b307d",
                        strokeOpacity: 0.4,
                        strokeWeight: 4
                    },
                    preserveViewport: true,
                    suppressMarkers: true,
                    icon: { scale: 3 }
                }}
            />

        </GoogleMap>
    );
};

export default withScriptjs(withGoogleMap(Markers));
