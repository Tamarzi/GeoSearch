import {gmt, currentTime} from "./time.js";
import {forwardGeoCode, placeQuery, queryImages, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";
import {weatherQueriesWithCoord} from "./weatherqueries.js";
import { celsiusToFahrenheit } from "./temperatureconversion.js";


const RenderBoardComponents = {
    async init(){
        this.temperatureUnit = "C";
        this.coordinates = await coords();
        console.log(this.coordinates);

        document.getElementById("pb-wrapper").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("wb-wrapper").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("place-image-wrapper").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("photo-slide").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("notable-places").innerHTML = `<div class="loaderspin"></div>`;
        
        const placeDetails = await placeQuery(this.coordinates);
        const weatherDetails = await weatherQueriesWithCoord(this.coordinates);

        renderMap(this.coordinates);
        await this.renderPlaceBoard(placeDetails);
        await this.renderWeatherBoard(weatherDetails);
        await this.renderPlaceImages(placeDetails);
        await this.renderNotablePlaces(placeDetails);
        this.onTemperatureConversionButtonClick();
    },

    async renderPlaceBoard(placeDetails){
        
        const pbwrapperElement = document.getElementById("pb-wrapper");
        pbwrapperElement.innerHTML = `<div class=loaderspin></div>`;

        const {country, locality, postcode} = placeDetails.results[0].location;
        const name = placeDetails.results[0].name;
        
        pbwrapperElement.innerHTML = ``;

        pbwrapperElement.innerHTML = `
            <div id="place-board">
                <p id="f-address">${name? name + ", ":""}</p>
                <h2 id="place-name">
                    <span id="state">${locality? locality + ", ":""}</span> 
                    <span id="country">${country? country + ". ":""}</span>
                </h2>
            </div>
        `;
    },

    async renderWeatherBoard(weatherDetails){
        const wbWrapper = document.getElementById("wb-wrapper");

        const {temperature, wind, humidity, pressure, iconId, iconName} = weatherDetails;
        
        const weatherIconURL = `http://openweathermap.org/img/wn/${iconId}.png`;
        this.temperatureValue = temperature;

        wbWrapper.innerHTML = `
            <div id="weather-board">
                <h4>
                    <span><i class="fas fa-thermometer-full"></i></span>
                    Weather Conditions
                </h4>
                <div id="temperature-wrapper">
                    <div id="temperature">
                        <span class="value">${Math.round(temperature)}</span>
                        <span class="degree">&deg</span>
                        <span class="unit">${this.temperatureUnit}</span>
                    </div>
                    <div id="weather-icon-wrapper">
                        <img src=${weatherIconURL} 
                            alt="weather-icon" 
                            id="weather-icon"
                        >
                        <div id="weather-icon-name">${iconName}</div>
                    </div>
                </div>                            
                <div id="conversion-button">
                    <button id="celsius-to-fahrenheit" class="temperature-converter">Convert to Fahrenheit</button>
                    <button id="fahrenheit-to-celsius" class="temperature-converter" style="display:none">Convert to Celsius</button>
                </div>
                <div id="weather-condition-wrapper">
                    <div id="wind-wrapper" class="weather-hover">
                        <label class="wname">Wind</label>
                        <div class="value-unit">
                            <span class="value">${wind}</span> 
                            <span class="unit">m/s</span>
                        </div>
                    </div>
                    <div id="humidity-wrapper" class="weather-hover">
                        <label class="wname">Humidity</label>
                        <div class="value-unit">
                            <span class="value">${humidity}</span> 
                            <span class="unit">&#37</span>
                        </div>
                    </div>
                    <div id="pressure-wrapper" class="weather-hover">
                        <label class="wname">Pressure</label>
                        <div class="value-unit">
                            <span class="value">${pressure}</span> 
                            <span class="unit">Pa</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async renderPlaceImages(placeDetails){
        const placeImageElement = document.getElementById("place-image-wrapper");
        
        const photoSlide = document.getElementById("photo-slide");

        const fsqId = placeDetails.results[0].fsq_id;
        
        const placeImagesRes = await queryImages(fsqId);

        photoSlide.innerHTML = ``;

        let i, len = placeImagesRes.length;
        console.log(len);

        if(len <= 1){
            photoSlide.innerHTML = `<p>No image to render here</p>`;    //not working, why??
        }

        for(i=0; i < len; i++){
            const imgSrc = placeImagesRes[i].prefix + "original" + placeImagesRes[i].suffix;

            if(i === 0){
                const placeImageOne = `<img src=${imgSrc} alt="" id="place-picture">`;
                placeImageElement.innerHTML = ``;
                placeImageElement.innerHTML = `<di id="place-image">` + placeImageOne + `</div>`;
            }
            else{
                const placeImageOthers = `<img src=${imgSrc} alt="" class="place-photo">`;
                photoSlide.innerHTML += placeImageOthers;
            }
        }
    },

    async renderNotablePlaces(placeDetails){
        const notablePlaces = document.getElementById("notable-places");

        notablePlaces.innerHTML = ``;
        notablePlaces.innerHTML += placeDetails.results.map((place) => {
            const rateMax = 5;
            const rating = Math.floor(Math.random() * (rateMax-1)) + 1;   //return a random between 1 and 5 both included

            let starRating = `<div class="star-ratings"><span>${rating + ".0"} </span>`;
            for(let i = 1; i <= rateMax; i++){
                if(i <= rating){
                    starRating += `<span class="star yellow"><i class="fas fa-star"></i></span>`;
                }
                else{
                    starRating += `<span class="star"><i class="fas fa-star"></i></span>`;
                    if(i === rateMax)
                        starRating += `</div>`
                }                
            }
            let imgSrc = "../assets/themepark_bg.png";
            let categoryName = "";

            if(place.categories[0]){
                categoryName = place.categories[0].name;
                imgSrc = place.categories[0].icon.prefix + "bg_120" + place.categories[0].icon.suffix;
            }

            return  `<div class="np-card">
                        <div class="np-card-desc">
                            <p class="place-name"><strong>${place.name}</strong></p>
                            <p class="address"><address>${place.location.formatted_address}</address></p>
                            <p class="category-name">${categoryName}</p>` +
                            starRating +
                        `</div>
                        <div class="np-card-icon">
                            <img src=${imgSrc} alt="" class="np-icon">
                        </div>
                    </div>
                    `;
        });

        const notablePlacesContainer = document.getElementById("notable-places-container");
        notablePlacesContainer.innerHTML += notablePlaces;
    },

    onTemperatureConversionButtonClick (){
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

const searchPlacesComponent = {
    async init(){      
        this.inp = document.getElementById("search-bar");
        this.renderAutoComplete();
        this.onKeyDown();
        this.closeAutoCompleteOnBodyClick();
        this.onSearchButtonClick();
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
    },

    async onSearchButtonClick(){
        const searchPlacesButton = document.getElementById("submit");

        searchPlacesButton.addEventListener("click", async() => {
            searchPlacesButton.disabled = true;
            this.placeWeatherBoardElement = ``;
            this.placeWeatherBoardElement = `<div class="loaderspin"></div>`;
            
            const searchBar = document.getElementById("search-bar");
            const placeAddress = searchBar.value;
            const coordinates = await forwardGeoCode(placeAddress);
            console.log(coordinates);
//            const weather = await weatherQueriesWithCoord(coordinates);
//            renderPlaceWeatherBoard();
//            renderNotablePlaces();
            renderMap(coordinates);

            searchBar.value = "";
            searchPlacesButton.disabled = false;
        });
    }
}

RenderBoardComponents.init();

searchPlacesComponent.init();