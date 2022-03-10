const reverseGeoCode = async(position) => {
    const apiKey = "W4SPlNvla5G56Tu2yD7AevlIAdqRokSI";
    let {latitude, longitude} = position.coords;
    let town = "";
    let city = "";
    let state = "";
    let country = "";
    let postalCode = "";
    const URL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${latitude}, ${longitude}`;
    try{
        const unCodedPlace = await fetch(URL, {"Method": "GET"});
        const data = await unCodedPlace.json();
        town = data.results[0].locations[0].adminArea5; //error somewhere accound here
        city = data.results[0].locations[0].adminArea4;
        state = data.results[0].locations[0].adminArea3;
        country = data.results[0].locations[0].adminArea1;
        postalCode = data.results[0].locations[0].postalCode;
        return {town, city, state, country, postalCode};
    }
    catch(e){
        console.log("Exceptional error - " + e);
    }
}

export {reverseGeoCode};