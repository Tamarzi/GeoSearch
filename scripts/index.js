import {gmt, currentTime} from "./time.js";
import {reverseGeoCode, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";
import {weatherQueriesWithCoord} from "./weatherqueries.js";
import { celsiusToFahrenheit } from "./temperatureconversion.js";

const currentPlacesUI = {
    async init(){
        this.temperatureUnit = "C";
        this.coordinates = await coords();
        console.log(this.coordinates);

        this.placeWeatherBoardElement = document.getElementById("place-weather-board");
        this.placeWeatherBoardElement.innerHTML = `<div class="loaderspin"></div>`;

        renderMap(this.coordinates);
        await this.renderPlaceWeatherBoard();
        this.onConvertTemperature();
    },

    async renderPlaceWeatherBoard(){
        const {state, country} = await reverseGeoCode(this.coordinates);
        const {temperature, wind, humidity, pressure, iconId, iconName} = await weatherQueriesWithCoord(this.coordinates);
        this.temperatureValue = temperature;
        const weatherIconURL = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

        const pwbwrapperMarkup = `
        <div id="pwb-wrapper">
            <div id="pb-wrapper">
                <div id="place-board">
                    <p>CURRENT LOCATION:</p>
                    <h2 id="place-name">
                        <span id="state">${state}</span>, 
                        <span id="country">${country}</span>
                    </h2>
                </div>
                <div id="weather-icon-wrapper">
                    <img src=${weatherIconURL} alt="weather-icon" id="weather-icon">
                    <div id="weather-icon-name">${iconName}</div>
                </div>
            </div>
            <h4>Weather Condition</h4>
            <div id="wb-wrapper">
                <div id="temperature-wrapper">
                    <div id="temperature">
                        <span class="value">${Math.round(temperature)}</span>
                        <span class="degree">&deg</span>
                        <span class="unit">${this.temperatureUnit}</span>
                    </div>
                    <button id="celsius-to-fahrenheit" class="temperature-converter" style="display:block">To Fahrenheit</button>
                    <button id="fahrenheit-to-celsius" class="temperature-converter" style="display:none">To Celsius</button>
                </div>
                <div id="weather-condition-wrapper">
                    <div id="wind-wrapper">
                        <span class="wname">Wind</span>
                        <span class="value">${wind}</span> 
                        <span class="unit">m/s</span>
                    </div>
                    <div id="humidity-wrapper">
                        <span class="wname">Humidity</span>
                        <span class="value">${humidity}</span> 
                        <span class="unit">&#37</span>
                    </div>
                    <div id="pressure-wrapper">
                        <span class="wname">Pressure</span>
                        <span class="value">${pressure}</span> 
                        <span class="unit">Pa</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        this.placeWeatherBoardElement.innerHTML = ``;
        this.placeWeatherBoardElement.innerHTML = pwbwrapperMarkup;
    },

    onConvertTemperature(){
        const celsToFahrButton = document.getElementById("celsius-to-fahrenheit");
        const fahrToCelButton = document.getElementById("fahrenheit-to-celsius");
        const tempValueElement = document.querySelector("#temperature > .value");
        const tempUnitElement = document.querySelector(".unit");

        celsToFahrButton.addEventListener("click", (evt) => {
            tempValueElement.innerText = parseInt(celsiusToFahrenheit(this.temperatureValue));
            this.temperatureUnit = "F";
            tempUnitElement.innerText = this.temperatureUnit;
            evt.target.style.display = "none";
            fahrToCelButton.style.display = "block";
        });

        fahrToCelButton.addEventListener("click", (evt) => {
            tempValueElement.innerText = parseInt(this.temperatureValue);
            this.temperatureUnit = "C";
            tempUnitElement.innerText = this.temperatureUnit;
            evt.target.style.display = "none";
            celsToFahrButton.style.display = "block";
        })
    }
}

const searchButtonUI = {
    async init(){      
        this.inp = document.getElementById("search-bar");
        this.renderAutoComplete();
        this.onKeyDown();
        this.closeAutoCompleteOnBodyClick();
    },

    set queryStr(stringValue){
        this.queryString = stringValue;
    },

    get queryStr(){
        return this.queryString;
    },

    closeAutoCompleteOnBodyClick(){
        document.addEventListener("click", () => {
            autocomplete.closeAllLists();
        });
    },

    async renderAutoComplete(){
        this.inp.addEventListener("input", async(evt) => {
            this.queryStr = evt.target.value;
            if(this.queryStr.length > 1){
                this.searchQueryResults = await querySearchAhead(this.queryStr);
                autocomplete.dropDown(this.inp, this.searchQueryResults);
            }
        });
    },

    onKeyDown(){
        this.inp.addEventListener("keydown", (evt) => {
            autocomplete.keyUpDown(evt);
        });
    }
}

currentPlacesUI.init();
searchButtonUI.init();