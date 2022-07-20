const convertLatLngToObj = (lat, lng) => {
    return {
        lat,
        lng
    };
};

const createLatLngObject = (latLng, returnStringObjval = false) => {
    if (typeof latLng === 'object' &&
        !Array.isArray(latLng) &&
        latLng !== null) {
        // console.log("Inside obj ceater", latLng)
        return latLng;
    }

    const latLngArray = latLng.split(",");
    if (!returnStringObjval) {
        return {
            lat: parseFloat(latLngArray[0]),
            lng: parseFloat(latLngArray[1])
        };
    } else {
        return {
            lat: latLngArray[0],
            lng: latLngArray[1]
        };
    }


};


const createLocationObject = (
    from,
    fromTitle,
    to,
    toTitle,
    strokeColor = "#f68f54"
) => {
    return {
        from: { ...createLatLngObject(from), fromTitle },
        to: { ...createLatLngObject(to), toTitle },
        strokeColor: strokeColor
    };
};

const createObjectCopy = (ObjectToCopy) => {
    return JSON.parse(JSON.stringify(ObjectToCopy))
}

const complexStateDeepCopy = (input) => {
    if (
        typeof input === 'number' ||
        typeof input === 'string' ||
        typeof input === 'boolean'
    )
        return input;
    if (Array.isArray(input)) {
        const newArr = [];
        for (let i = 0; i < input.length; i++) {
            newArr.push(complexStateDeepCopy(input[i]));
        }
        return newArr;
    } else {
        const newObj = {};
        for (let key in input) {
            if (input.hasOwnProperty(key)) {
                newObj[key] = complexStateDeepCopy(input[key]);
            }
        }
        return newObj;
    }
};

export { convertLatLngToObj, createLocationObject, createLatLngObject, createObjectCopy, complexStateDeepCopy };