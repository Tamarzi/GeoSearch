import {gmt, currentTime} from "./time.js";
import {reverseGeoCode} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";

/*can try changing the load event to the 'DOMContentLoaded'
 to see the effect, may be the better option*/
//let placeHeader = document.querySelector("#logo-container>h1");
const MY_GOOGLE_API_KEY="AIzaSyDZJpUJo63HxFIUJEHOSX_L-5PyUmucYTk";
const MY_MAPQUEST_API_KEY="W4SPlNvla5G56Tu2yD7AevlIAdqRokSI";

window.addEventListener("DOMContentLoaded", () => {
    /*The aim of this function is to load google map when DOM is loaded*/
    let townElement = document.getElementById("town");
    let cityElement = document.getElementById("city");
    let stateElement = document.getElementById("state");
    let countryElement = document.getElementById("country");
    let postalCodeElement = document.getElementById("zipcode");
    let mapFrame = document.getElementById("map");

    if("geolocation" in navigator){
        navigator.geolocation.watchPosition(async(position) => {      //find a way to remove this async here
            const {town, city, state, country, postalCode} = await reverseGeoCode(position);

            townElement.innerText = town.toString();
            cityElement.innerText = city.toString();
            stateElement.innerText = state.toString();
            countryElement.innerText = country.toString();
            postalCodeElement.innerText = postalCode.toString();
            
            //placging the map on the map element
            let {latitude, longitude} = position.coords;
            const URL = `https://www.google.com/maps/embed/v1/place?key=${MY_GOOGLE_API_KEY}&q=${latitude}, ${longitude}`;
            mapFrame.src = URL;
        });
    }
    else{
        console.log("No Geolocation attributes");
    }
});

//Entering time and timezone to the time elements.
const timeZoneElement = document.getElementById("time");
timeZoneElement.innerText = gmt();
/*
const timeElement = document.querySelector("time");
setInterval(() => {
    timeElement.innerText = currentTime();
}, 1000); */

autocomplete();