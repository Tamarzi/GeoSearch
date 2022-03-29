import {gmt, currentTime} from "./time.js";
import {reverseGeoCode, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";

const currentPlacesUI = {
    async init(){
        //Set the map to the iframe element with id=map.
        this.mapFrame = document.getElementById("map");
        this.placeBoardElement = document.createElement("div");
//        this.weatherBoardElement = document.createElement("div");
        this.placeWeatherBoardElement = document.getElementById("place-weather-board");
        this.coordinates = await coords();
        this.place = await reverseGeoCode(this.coordinates);
        //this.weather = await weatherConditions(); 

        console.log(this.coordinates);

        renderMap(this.mapFrame, this.coordinates);
        this.clearPlaceWeatherBoard();
        this.renderPlaceBoard();
//        renderWeatherBoard();
    },

    clearPlaceWeatherBoard(){
        this.placeWeatherBoardElement.innerHTML = "";
    },

    placeValidation(){
        if(!this.place.town){
            this.place.town = "town Undetected";
        }
        if(!this.place.state){
            this.place.state = "state undetected";
        }
        if(!this.place.city){
            this.place.city = "city undetected";
        }
        if(!this.place.country){
            this.place.country = "country undetected";
        }
        if(!this.place.postalCode){
            this.place.postalCode = "postalCode undetected";
        }
    },

    renderPlaceBoard(){
        this.placeValidation();
        this.placeBoardElement.setAttribute("id", "placeboard");
        this.placeBoardElement.innerHTML = 
            `<div>
                <p>CURRENT LOCATION:</p>
                <h2 id="town">${this.place.town.toString()}</h2>
                <p>
                    <span id="city">${this.place.city.toString()}</span>, 
                    <span id="state">${this.place.state.toString()}</span>, 
                    <span id="country"${this.place.country.toString()}</span>
                </p>
                <p id="zipcode">${this.place.postalCode.toString()}</p>
            </div>
            <div id="gmtboard">
                <p>GMT + <span id="time">${gmt()}</span></p>
            </div>`;

            this.placeWeatherBoardElement.append(this.placeBoardElement);
    },

    renderWeatherBoard(){
        this.weatherBoardElement.setAttribute("id", "weatherboard");
        this.weatherBoardElement.innerHTML = 
            `<div id="weatherboard">
                <div id="temperature">
                    <h4>Temperature</h4>
                    <p><i class="fas fa-3x fa-thermometer-full"></i></p>
                    <p><span>${temperature}</span><span>C</span></p>
                    <button id="convert-temperature">Fahrenheit</button>
                </div>
                <div id="windspeed">
                    <h4>Windspeed</h4>
                    <p><i class="fas fa-3x fa-wind"></i></p>
                    <p><span>${windspeed}</span><span>mps</span></p>
                </div>
                <div id="humidity">
                    <h4>Humidity</h4>
                    <p><i class="fas fa-3x fa-atom"></i></p>
                    <p><span>${humidity}</span><span>g/kg</span></p>
                </div>
            </div>`;

            this.placeWeatherBoardElement.append(this.weatherBoardElement);
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