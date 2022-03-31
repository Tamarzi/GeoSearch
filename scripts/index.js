import {gmt, currentTime} from "./time.js";
import {reverseGeoCode, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";

const currentPlacesUI = {
    async init(){
        this.temperatureUnit = "C";
        //Set the map to the iframe element with id=map.
        this.mapFrame = document.getElementById("map");
        this.placeWeatherBoardElement = document.getElementById("place-weather-board");
        this.placeWeatherBoardElement.innerHTML = `<div class="loaderspin"></div>`;

        //this.weather = await weatherQuery(); 

//        renderMap(this.mapFrame, this.coordinates);
        this.renderPlaceWeatherBoard();
    },

    async renderPlaceWeatherBoard(){
        const coordinates = await coords();
        const {state, country} = await reverseGeoCode(coordinates);

        this.weatherIconElement = "../assets/heartpoint-64x64.png";
        this.weatherIconName = "Broken Cloud";
        this.weatherTemp = 6;
        this.weatherWind = 33;
        this.weatherHumidity = 80;
        this.weatherPressure = 1115;

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
                    <img src=${this.weatherIconElement} alt="weather-icon" id="weather-icon">
                    <div id="weather-icon-name">${this.weathericonName}</div>
                </div>
            </div>
            <h4>Weather Condition</h4>
            <div id="wb-wrapper">
                <div id="temperature-wrapper">
                    <div id="temperature">
                        <span class="value">${this.weatherTemp}</span>
                        <span class="degree">&deg</span>
                        <span class="unit">${this.temperatureUnit}</span>
                    </div>
                    <button class="temperature-converter">To Fahrenheit</button>
                </div>
                <div id="weather-condition-wrapper">
                    <div id="wind-wrapper">
                        <span class="wname">Wind</span>
                        <span class="value">${this.weatherWind}</span> 
                        <span class="unit">m/s</span>
                    </div>
                    <div id="humidity-wrapper">
                        <span class="wname">Humidity</span>
                        <span class="value">${this.weatherHumidity}</span> 
                        <span class="unit">&#37</span>
                    </div>
                    <div id="pressure-wrapper">
                        <span class="wname">Pressure</span>
                        <span class="value">${this.weatherPressure}</span> 
                        <span class="unit">Pa</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        this.placeWeatherBoardElement.innerHTML = ``;
        this.placeWeatherBoardElement.innerHTML = pwbwrapperMarkup;
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