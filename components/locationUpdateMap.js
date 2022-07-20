import React, { Fragment, memo, useCallback, useEffect, useState } from 'react'
import { Autocomplete, GoogleMap, Marker, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import { createLatLngObject } from '../utils/helper';
import { Button, Stack } from '@shopify/polaris';

import axios from 'axios';
import { enviornment } from '../utils/envConfig';
import ToastUp from './toast';

const libs = ["places"];

const LocationUpdateMap = (props) => {

    const [location, setLocation] = useState({});

    const [zoom, setZoom] = useState(3);
    const [autocomplete, setAutocomplete] = useState();
    const [markerPoint, setMarkerPoint] = useState();
    const [placeDetails, setPlaceDetails] = useState();

    const [placeupdated, setPlaceupdated] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastErrorMessage, setToastErrorMessage] = useState(false);
    // * Constructing toast
    const constructTostStates = (msg, errorMsg) => {
        setToastMessage(msg);
        setToastActive(true);
        setToastErrorMessage(errorMsg);
    }

    const setLocationObj = (title, lat, lng) => {
        let locTitle = title;

        let location = {
            "title": "",
            "lat": "",
            "lng": "",
            "latLng": ""
        }

        if (locTitle != 'marker') {
            if (!locTitle.includes('*')) {
                //* adding * as a indicator that this location has been updated on request
                locTitle = locTitle + '*';
            }
            if (lat && lng) {
                location = {
                    "title": locTitle?.toString(),
                    "lat": lat.toString(),
                    "lng": lng.toString(),
                    "latLng": lat.toString() + "," + lng.toString()
                }
            }
        } else if (locTitle == 'marker') {
            if (lat && lng) {
                location = {
                    "title": (placeDetails?.name).toString() + "*",
                    "lat": lat.toString(),
                    "lng": lng.toString(),
                    "latLng": lat.toString() + "," + lng.toString()
                }
            }
        } else {
            locTitle = "Updated Location*";
            if (lat && lng) {
                location = {
                    "title": locTitle?.toString(),
                    "lat": lat.toString(),
                    "lng": lng.toString(),
                    "latLng": lat.toString() + "," + lng.toString()
                }
            }
        }
        setLocation(location);
    }

    const containerStyle = {
        width: props.containerWidth,
        height: props.containerHeight
    };
    const { isLoaded, loadError } = useLoadScript({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDms1aD63mLSJn0Aq9c6v_y0U2be2ogTwI",
        libraries: libs
    })

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(3)
        const bounds = new window.google.maps.LatLngBounds(createLatLngObject("12.9628018,77.5758862"));
        map.fitBounds(bounds);
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const autoCompleteOnLoad = (autocomplete) => {
        // console.log('autocomplete: ', autocomplete)
        setAutocomplete(autocomplete);
    }
    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            let place = autocomplete?.getPlace();
            console.log(place);
            setPlaceDetails(place);
            setMarkerPoint(place?.geometry?.location);
            setLocationObj(place?.name, place?.geometry?.location?.lat(), place?.geometry?.location?.lng())
            setZoom(10);
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }
    const onDragMarker = (location) => {
        if (location !== null) {
            console.log(location);
            setMarkerPoint(location.latLng);
            setLocationObj('marker', location.latLng.lat(), location.latLng.lng())
            // setPlaceDetails(autocomplete.getPlace());
        } else {
            console.log('Could not get place')
        }
    }
    const updateLocationHandler = () => {

        // if (!placeupdated) {
        if (location.lat && location.lng) {
            setIsLoading(true);
            let baseUrl = enviornment.API_CLIENT.URL;
            try {
                axios.put(`${baseUrl}/api/v2/admin/orders/update-location/${props.token}`, { location: location }).then(response => {

                    if (response.data.status) {
                        let orderDetails = response.data.data;
                        console.log(orderDetails);
                        constructTostStates(response.data.msg, !response.data.status);
                        setIsLoading(false);
                        setPlaceupdated(true);
                    }
                    else {
                        constructTostStates(response.data.msg, !response.data.status);
                    }
                })
            } catch (err) {
                setIsLoading(false);
                console.log(err);
            }
        } else {
            constructTostStates("Cannot get location", true);
        }
        // }
    }

    const toastMarkup = toastActive ? (
        <ToastUp text={toastMessage} toastErrorMessage={toastErrorMessage} toggleToastActive={() => setToastActive(false)} duration={5000} />
    ) : null;


    return isLoaded ? (
        <Fragment>
            <style jsx>{`
             .search-field{
                box-sizing: border-box;
                border: 1px solid transparent;
                width: 240px;
                height: 32px;
                padding: 0px 12px;
                border-radius: 3px;
                box-shadow: rgb(0 0 0 / 30%) 0px 2px 6px;
                font-size: 14px;
                outline: none;
                position: absolute;
                left: 62%;
                top: 2%;
                margin-left: -120px;
             }
             @media screen and (max-width: 955px) {
                .search-field {
                    width: 200px;
                    left: 70%;
                }
             }
             @media screen and (max-width: 875px) {
                .search-field {
                    width: 150px;
                    left: 79%;
                }
             }
             @media screen and (max-width: 803px) {
                .search-field {
                    width: 240px;
                    left: 62%;
                }
             }
             @media screen and (max-width: 645px) {
                .search-field {
                    width: 200px;
                    left: 70%;
                }
             }
             @media screen and (max-width: 575px) {
                .search-field {
                    width: 150px;
                    left: 79%;
                }
             }
             @media screen and (max-width: 512px) {
                .search-field {
                    left: 90%;
                    top: 15%;
                }
             }
             `}</style>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPoint}
                zoom={3 || zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Autocomplete
                    onLoad={autoCompleteOnLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Search your place here"
                        className="search-field"
                    />
                </Autocomplete>
                <Marker
                    position={markerPoint}
                    draggable={true}
                    onDragEnd={onDragMarker}
                />
            </GoogleMap>
            <br />
            <Stack alignment="center">
                <Stack.Item fill>
                    {placeDetails?.formatted_address &&
                        <Fragment> Selected Location :<br />
                            <b>{placeDetails?.name}</b><br />
                            <b>{placeDetails?.formatted_address}</b>
                        </Fragment>}
                </Stack.Item>
                <Stack.Item><Button primary={placeupdated} onClick={updateLocationHandler} loading={isLoading}>{!placeupdated ? "Update Location" : "Location Updated!"}</Button></Stack.Item>
            </Stack>
            {toastMarkup}
        </Fragment>
    ) : loadError ? <div>Map cannot be loaded right now, sorry.</div> : <></>
}

export default memo(LocationUpdateMap)