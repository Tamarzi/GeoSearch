import {gmt, currentTime} from "./time.js";
import {reverseGeoCode, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";

const currentPlacesUI = {
    async init(){
        this.temperatureUnit = "celsius";
        //Set the map to the iframe element with id=map.
        this.mapFrame = document.getElementById("map");
//        this.weatherBoardElement = document.createElement("div");

        this.placeNameElement = document.getElementById("place-name");
        this.stateSpanElement = document.getElementById("state");
        this.countrySpanElement = document.getElementById("country");
        this.weatherIconElement = document.getElementById("weather-icon");
        this.weatherIconName = document.getElementById("weather-icon-name");

        this.temperatureValueElement = document.querySelector("#temperature > .value");
        this.temperatureUnitElement = document.querySelector("#temperature > .unit");

        this.windValueElement = document.querySelector("#wind-wrapper > .value");

        this.humidityValueElement = document.querySelector("#humidity-wrapper > .value");

        this.pressureValueElement = document.querySelector("#pressure-wrapper > .value");

        this.fahrenheitButtonElement = document.createElement("button");
        this.celsiusButtonElement = document.createElement("button");

//        this.coordinates = await coords();
//        this.place = await reverseGeoCode(this.coordinates);
        //this.weather = await weatherConditions(); 

//        console.log(this.coordinates);

//        renderMap(this.mapFrame, this.coordinates);
        this.renderPlaceBoard();
        this.renderWeatherBoard();
    },

    renderPlaceBoard(){
        this.countrySpanElement.innerText = "GB";
        this.stateSpanElement.innerText = "London";

        this.weatherIconElement.src = "../assets/heartpoint-64x64.png";
        this.weatherIconName = "Broken Cloud";
    },

    renderWeatherBoard(){
        this.temperatureValueElement.innerText = 20;
        this.temperatureUnitElement.innnerHTML = "C";
        this.windValueElement.innerText = 10;
        this.humidityValueElement.innerText = 90;
        this.pressureValueElement.innerText = 1010;

        this.fahrenheitButtonElement.setAttribute("class", "temperature-converter");
        this.fahrenheitButtonElement.textContent = "To Fahrenheit";
        this.celsiusButtonElement.setAttribute("class", "temperature-converter");
        this.celsiusButtonElement.textContent = "To Celsius";

        const conversionButton = ((this.temperatureUnit === "celsius")? this.fahrenheitButtonElement:this.celsiusButtonElement);
    }
},

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