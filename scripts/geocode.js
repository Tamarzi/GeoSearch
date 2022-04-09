const keys = {
    MY_GOOGLE_API_KEY: "AIzaSyDZJpUJo63HxFIUJEHOSX_L-5PyUmucYTk",
    MAPQUEST_API_KEY: "W4SPlNvla5G56Tu2yD7AevlIAdqRokSI"
}

const forwardGeoCode = async(placeName) => {
    const URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${keys.MAPQUEST_API_KEY}&location=${placeName}`;

    const response = await fetch(URL, 
        {
            "Method": "GET"
        });
        
    const data = await response.json();
    const latitude = data.results[0].locations[0].latLng.lat;
    const longitude = data.results[0].locations[0].latLng.lng;

    return {latitude, longitude};
}

const reverseGeoCode = async(position) => {
    const {latitude, longitude} = position;

    const URL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${keys.MAPQUEST_API_KEY}&location=${latitude},${longitude}`;
    try{
        const unCodedPlace = await fetch(URL, {"Method": "GET"});
        const data = await unCodedPlace.json();

        let town = data.results[0].locations[0].adminArea5; //error somewhere around here
        let city = data.results[0].locations[0].adminArea4;
        let state = data.results[0].locations[0].adminArea3;
        let country = data.results[0].locations[0].adminArea1;
        let postalCode = data.results[0].locations[0].postalCode;

        console.log(town, city, state, country, postalCode)

        return {town, city, state, country, postalCode};
    }
    catch(e){
        console.log("Exceptional error - " + e);
    }
}

const renderMap = (position) => {
    const {latitude, longitude} = position;
    //Set the map to the iframe element with id=map.
    const mapNode = document.getElementById("map");
    const URL = `https://www.mapquestapi.com/staticmap/v5/map?key=${keys.MAPQUEST_API_KEY}&locations=${latitude},${longitude}&center=${position.latitude},${position.longitude}&size=800,450`;
//    const URL = `https://www.google.com/maps/embed/v1/place?key=${keys.MY_GOOGLE_API_KEY}&q=${position.latitude},${position.longitude}`;
    mapNode.src = URL;
}

const querySearchAhead = async(queryValue) => {
    const reqObj = {
        limit: 9,
        feedback: false,
        collection: ["adminArea", "airport", "poi", "franchise"],
    }

    const URL = `http://www.mapquestapi.com/search/v3/prediction?key=${keys.MAPQUEST_API_KEY}&limit=${reqObj.limit}&collection=${reqObj.collection}&q=${queryValue}`;

    const requestPlaces = await fetch(URL, {"Method": "GET"});
    const data = await requestPlaces.json();

    return data.results;
}

const searchPlace = async(position) => {
    const URL = `http://www.mapquestapi.com/search/v4/place?key=W4SPlNvla5G56Tu2yD7AevlIAdqRokSI&location=9.072264,%207.491302&q=hotel&sort=relevance`
}

export {forwardGeoCode, reverseGeoCode, renderMap, querySearchAhead};