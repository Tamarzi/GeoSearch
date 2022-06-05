import { mapLoaderSpinHidden } from "./helper.js";

const keys = {
    MY_GOOGLE_API_KEY: "AIzaSyDZJpUJo63HxFIUJEHOSX_L-5PyUmucYTk",
    MAPQUEST_API_KEY: "W4SPlNvla5G56Tu2yD7AevlIAdqRokSI",
    FOURSQUARE_API_KEY: "fsq3S900agOQ3grPYP+ol+m+ySBa3FY6u50yWXROKVFAav4="
}

const forwardGeoCode = async(placeName) => {
    const URL = `https://www.mapquestapi.com/geocoding/v1/address?key=${keys.MAPQUEST_API_KEY}&location=${placeName}`;

    const response = await fetch(URL, 
        {
            "Method": "GET"
        });
        
    const data = await response.json();
    const latitude = data.results[0].locations[0].latLng.lat;
    const longitude = data.results[0].locations[0].latLng.lng;

    return {latitude, longitude};
}

/*
const reverseGeoCode = async(position) => {
    const {latitude, longitude} = position;

    const URL = `https://www.mapquestapi.com/geocoding/v1/reverse?key=${keys.MAPQUEST_API_KEY}&location=${latitude},${longitude}`;
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
}*/

const placeQueryWithCoord = async(coordinates) => {
    const {latitude, longitude} = coordinates;
//    const {latitude, longitude} = {latitude: 9.0765, longitude: 7.3986};

    const URL = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=90000`;
    try{
        const response = await fetch(URL, 
            {
                "method": "GET",
                "mode": "cors",
                "headers": {
                    "authorization": "fsq3S900agOQ3grPYP+ol+m+ySBa3FY6u50yWXROKVFAav4=",
                    "content-type": "application/json",
//                    'Access-Control-Allow-Origin': 'origin'
                }
            }
        );
        const places = await response.json();

        return places;
    }
    catch(e){
        console.log("Exceptional Error: " + e);
    }
}

const placeQueryWithName = async(placeAddressArray) => {
    const [name, locality] = placeAddressArray;
    let URL = `https://api.foursquare.com/v3/places/search?query=${name}&near=${locality}`;

    if(!locality){
        URL = `https://api.foursquare.com/v3/places/search?query=${name}`;
    }
    try{
        const response = await fetch(URL, {
            "method": "GET",
            "mode": "cors",
            "headers": {
                "authorization": "fsq3S900agOQ3grPYP+ol+m+ySBa3FY6u50yWXROKVFAav4=",
                "content-type": "application/json",
//                    'Access-Control-Allow-Origin': 'origin'
            }  
        });

        const placeResults = await response.json();

        return placeResults;
    }
    catch(err){
        console.log("Exception: " + err);
    }
}

const queryImages = async(imgId) => {
    const URL = `https://api.foursquare.com/v3/places/${imgId}/photos`;
    try{
        const response = await fetch(URL, {
            "method": "GET",
            "mode": "cors",
            "headers": {
                "authorization": "fsq3S900agOQ3grPYP+ol+m+ySBa3FY6u50yWXROKVFAav4=",     //"authorization": "key" or "x-api-key"
                "content-type": "application/json"
            }
        });

        const imagesData = await response.json();

        return imagesData;
    }
    catch(e){
        console.log("Exceptional Error: " + e);
    }
}

const renderMap = (placeDetails) => {
//    const {latitude, longitude} = position;

    const coordinates = placeDetails.results.map((res) => res.geocodes.main);

    //Set the map to the iframe element with id=map.
    if(coordinates && coordinates.length){
        let URL = `https://www.mapquestapi.com/staticmap/v5/map?key=${keys.MAPQUEST_API_KEY}
        &locations=${coordinates[0].latitude},${coordinates[0].longitude}|https://res.cloudinary.com/trmrskie/image/upload/v1652304644/geosearch/heartpoint-64x64_zkhnig.png`;
        const len = coordinates.length;
        for(let i = 1; i < len; i++){
            URL += `||${coordinates[i].latitude},${coordinates[i].longitude}|https://res.cloudinary.com/trmrskie/image/upload/v1652304649/geosearch/silverheart-64x64_lztjes.png`;
        }
        URL += `&size=@2x&center=${coordinates[0].latitude},${coordinates[0].longitude}&size=800,450`;
        document.getElementById("map").src = URL;
    }
    else{
        console.log("Cannot get coordinates");
    }
    
    mapLoaderSpinHidden();
}

const querySearchAhead = async(queryValue) => {
    const reqObj = {
        limit: 9,
        feedback: false,
        collection: ["adminArea", "airport", "poi", "franchise"],
    }

    const URL = `https://www.mapquestapi.com/search/v3/prediction?key=${keys.MAPQUEST_API_KEY}&limit=${reqObj.limit}&collection=${reqObj.collection}&q=${queryValue}`;

    const requestPlaces = await fetch(URL, {"Method": "GET"});
    const data = await requestPlaces.json();

    return data.results;
}

const searchPlace = async(position) => {
    const URL = `https://www.mapquestapi.com/search/v4/place?key=W4SPlNvla5G56Tu2yD7AevlIAdqRokSI&location=9.072264,%207.491302&q=hotel&sort=relevance`
}

export {forwardGeoCode, placeQueryWithCoord, placeQueryWithName, queryImages, renderMap, querySearchAhead};