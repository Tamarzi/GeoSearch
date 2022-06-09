import {gmt, currentTime} from "./time.js";
import { mapLoaderSpinVisible, searchButtonSpinOff, searchButtonSpinOn } from "./helper.js";
import {forwardGeoCode, placeQueryWithCoord, placeQueryWithName, queryImages, renderMap, querySearchAhead} from "./geocode.js";
import {autocomplete} from "./autocomplete.js";
import coords from "./coordinates.js";
import {weatherQueriesWithCoord} from "./weatherqueries.js";
import { celsiusToFahrenheit } from "./temperatureconversion.js";


const RenderBoardComponents = {
    async init(){
        this.temperatureUnit = "C";

        //try more ways to use the navigator.permissions.query({name: 'geolocation'})
        this.coordinates = await coords();
        this.clearErrorBoard();
        console.log(this.coordinates);

        mapLoaderSpinVisible();
        document.getElementById("pb-wrapper").innerHTML = `<div class ="loaderspin"></div>`;
        document.getElementById("wb-wrapper").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("place-image-wrapper").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("photo-slide").innerHTML = `<div class="loaderspin"></div>`;
        document.getElementById("notable-places").innerHTML = `<div class="loaderspin"></div>`;
        
        const placeDetails = await placeQueryWithCoord(this.coordinates);
        const weatherDetails = await weatherQueriesWithCoord(this.coordinates);

        renderMap(placeDetails);
        this.renderPlaceBoard(placeDetails);
        this.renderWeatherBoard(weatherDetails);
        await this.renderPlaceImages(placeDetails);
        this.scrollPhotos();
        this.renderNotablePlaces(placeDetails);
    },

    renderPlaceBoard(placeDetails){
        if(placeDetails.results && placeDetails.results.length){
            const pbwrapperElement = document.getElementById("pb-wrapper");
            pbwrapperElement.innerHTML = `<div class=loaderspin></div>`;
    
            const {country, locality, postcode} = placeDetails.results[0].location;
            const name = placeDetails.results[0].name;
            
            pbwrapperElement.innerHTML = ``;
    
            pbwrapperElement.innerHTML = `
                <div id="place-board">
                    <h2 id="f-address">${name? name + ", ":""}</h2>
                    <p id="place-name">
                        <span id="state">${locality? locality + ", ":""}</span> 
                        <span id="country">${country? country + ". ":""}</span>
                    </p>
                </div>
            `;
        }
        else{
            console.log("Place details is not defined by Simon (placeboard)");
        }
    },

    renderWeatherBoard(weatherDetails){
        if(weatherDetails){
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
            
            this.onTemperatureConversionButtonClick();
        }
        else{
            console.log("weatherdetails is not defined by Simon (weatherboard)");
        }

    },

    async renderPlaceImages(placeDetails){
        if(placeDetails.results && placeDetails.results.length){
            const placeImageElement = document.getElementById("place-image-wrapper");
        
            const photoSlide = document.getElementById("photo-slide");
    
            const fsqId = placeDetails.results[0].fsq_id;
            
            const placeImagesRes = await queryImages(fsqId);
    
            placeImageElement.innerHTML = ``;
            photoSlide.innerHTML = ``;
    
            let i, len = placeImagesRes.length;
            console.log(len);

            if(len === 0){
                placeImageElement.innerHTML = ``;
            }
    
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
        }

    },

    renderNotablePlaces(placeDetails){
        if(placeDetails.results && placeDetails.results.length){
            const notablePlaces = document.getElementById("notable-places");
            notablePlaces.innerHTML = ``;
    
            placeDetails.results.map((place) => {
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
    
                const npCard = document.createElement("div");
                npCard.setAttribute('class', 'np-card');
                npCard.innerHTML = 
                            `<div class="np-card-desc">
                                <p class="place-name"><strong>${place.name}</strong></p>
                                <p class="address"><address>${place.location.formatted_address}.</address></p>
                                <p class="category-name"><strong>${categoryName}</strong></p>` +
                                starRating +
                            `</div>
                            <div class="np-card-icon">
                                <img src=${imgSrc} alt="" class="np-icon">
                            </div>`;
    
                                    
                npCard.addEventListener('click', (evt) => {
                    console.log("npcard with" + place.name + "clicked", evt);
                });
    
                notablePlaces.appendChild(npCard);
            });
    
            const notablePlacesContainer = document.getElementById("notable-places-container");
            notablePlacesContainer.innerHTML += notablePlaces;
        }

    },

    clearErrorBoard(){
        document.getElementById("error").innerHTML = ``;

        document.getElementById("share-icon-section").style.display = "block";
        document.getElementById("photos-container").style.display = "block";
        document.getElementById("notable-places-container").style.display = "block";
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
    },

    scrollPhotos(){
        let posLeft = 0;
        const photoSlide = document.getElementById("photo-slide");
        const photoContainer = document.getElementById("photos-container");

        //Every time the page loads set the scroll position to 0.
        photoSlide.scroll(posLeft, 0);

        photoContainer.addEventListener("mouseover", () => {
            const imgArray = photoSlide.getElementsByTagName("img");
            //if the images inside photocontainer is more than or equal to 3, do the following:
            if(imgArray.length >= 3){

                //Make visible the the prev button if photoslide is not at starting position.
                if(photoSlide.scrollLeft > 0){
                    document.getElementById("prev").style.visibility = "visible";
                }

                //Make visible the next buttion.
                document.getElementById("next").style.visibility = "visible";
            }
        });

        //On mouse out return to normal.
        photoContainer.addEventListener("mouseout", () => {
            document.getElementById("prev").style.visibility = "hidden";
            document.getElementById("next").style.visibility = "hidden";
        });

        //On clicking prev buttion do the following.
        document.getElementById("prev").addEventListener("click", (evt) => {
            //if scroll is at the left end, execute as follows else
            if(photoSlide.scrollLeft <= 0){
                evt.preventDefault();
                console.log("start" + true);
            }
            else{
                posLeft -= 184.5;
                photoSlide.scroll(posLeft, 0);
                console.log("< clicked");
            }
        //    document.getElementById("scrollable-pane").scrollLeft -= 320;
        });

        document.getElementById("next").addEventListener("click", (evt) => {
            //if scroll is at the right end, execute as follows else
            if(photoSlide.offsetWidth + photoSlide.scrollLeft >= photoSlide.scrollWidth){
                evt.preventDefault();
                console.log("end" + true);
            }
            else{
                posLeft += 184.5;
                photoSlide.scroll(posLeft, 0);
                console.log("> clicked");
            }
        });
    }
}

const searchComponent = {
    async init(){      
        this.inp = document.getElementById("search-bar");
        this.renderAutoComplete();
        this.onKeyDown();
        this.closeAutoCompleteOnBodyClick();
        this.onSearchButtonClick();
//find a better place to put the functions below.
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
                ToolTipComponent.closeToolTip();
                this.searchQueryResults = await querySearchAhead(this.queryStr);
                autocomplete.dropDown(this.inp, this.searchQueryResults);
            }
            else{
                autocomplete.closeAllLists();
            }
        });
    },

    onKeyDown(){
        this.inp.addEventListener("keydown", (evt) => {
            autocomplete.keyUpDown(evt);
        });
    },

    async onSearchButtonClick(){
        const searchPlacesButton = document.getElementsByClassName("submit")[0];

        searchPlacesButton.addEventListener("click", async(evt) => {

            searchButtonSpinOn();
            const searchBar = document.getElementById("search-bar");
            const placeAddressString = searchBar.value;

            const placeAddressArray = placeAddressString.split(",");
            const len = placeAddressArray.length;

            let coordinates, placeDetails, weatherDetails;

            if(len <= 2){
                placeDetails = await placeQueryWithName(placeAddressArray);
                console.log(placeDetails);
                if(!placeDetails.results[0]){

                    ToolTipComponent.closeToolTip();  
                    ToolTipComponent.openErrorToolTip();
                      
                    setTimeout(()=>{
                        ToolTipComponent.closeErrorToolTip();
                    }, 3000);
                    console.log("placeDetails undefined (len < 2)");
                }
                else{
                    coordinates = placeDetails.results[0].geocodes.main;
                    weatherDetails = await weatherQueriesWithCoord(coordinates);
                }
            }
            else{
                let name, locality;
                if(len === 3){
                    [name, locality] = placeAddressArray;
                }
                if(len === 4){
                    [name, , locality,] = placeAddressArray;
                }

                const paa = [name, locality];
                placeDetails = await placeQueryWithName(paa);
                coordinates = placeDetails.results[0].geocodes.main;
                weatherDetails = await weatherQueriesWithCoord(coordinates);
            }

            mapLoaderSpinVisible();
            
            renderMap(placeDetails);
            RenderBoardComponents.clearErrorBoard();
            RenderBoardComponents.renderPlaceBoard(placeDetails);
            RenderBoardComponents.renderWeatherBoard(weatherDetails);
            await RenderBoardComponents.renderPlaceImages(placeDetails);
            RenderBoardComponents.renderNotablePlaces(placeDetails);

            searchBar.value = "";
            searchButtonSpinOff();
        });
    }
}

const ToolTipComponent = {
    init(){
        this.mouseOverToolTip();
        this.mouseLeaveToolTip();
    },
    openErrorToolTip(){
        const errortiptext = document.getElementById("errortiptext");
        errortiptext.innerHTML = `
            <div>
                <p>Not found!!, choose from autocomplete menu or use the format below: </p>
                <br>
                <p>
                    <q>Place Name, Locality</q>
                    <br>
                    <p>e.g. <kbd>Eiffel, Paris</kbd></p>
                </p>
            </div>
        `;

        errortiptext.style.visibility = 'visible';
    },
    closeErrorToolTip(){
        document.getElementById("errortiptext").style.visibility = "hidden";
    },
    closeToolTip(){
        document.querySelector(".tooltip > #tooltiptext").style.visibility = "hidden";
    },
    mouseOverToolTip(){
        document.querySelector(".tooltip").addEventListener("mouseover", (evt) => {
            document.getElementById("tooltiptext").style.visibility = "visible";
        });
    },
    mouseLeaveToolTip(){
        document.querySelector(".tooltip").addEventListener("mouseleave", (evt) => {
            document.getElementById("tooltiptext").style.visibility = "hidden";
        });
    }
}

RenderBoardComponents.init();
searchComponent.init();
ToolTipComponent.init();