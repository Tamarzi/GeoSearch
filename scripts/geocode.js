const keys = {
    MY_GOOGLE_API_KEY: "AIzaSyDZJpUJo63HxFIUJEHOSX_L-5PyUmucYTk",
    MAPQUEST_API_KEY: "W4SPlNvla5G56Tu2yD7AevlIAdqRokSI"
}

const reverseGeoCode = async(position) => {
    const {latitude, longitude} = position;

    const URL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${keys.MAPQUEST_API_KEY}&location=${latitude}, ${longitude}`;
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

const renderMap = (mapNode, position) => {
    const URL = `https://www.google.com/maps/embed/v1/place?key=${keys.MY_GOOGLE_API_KEY}&q=${position.latitude},${position.longitude}`;
    mapNode.src = URL;
}

export {reverseGeoCode, renderMap};