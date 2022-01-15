/*can try changing the load event to the 'DOMContentLoaded'
 to see the effect, may be the better option*/
const MY_GOOGLE_API_KEY="AIzaSyDZJpUJo63HxFIUJEHOSX_L-5PyUmucYTk";
//let placeHeader = document.querySelector("#logo-container>h1");
window.addEventListener("DOMContentLoaded", () => {
    let mapFrame = document.getElementById("map");
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition((position)=>{
            reverseGeoCode(position);
            mapFrameSrc(mapFrame, position);
        });
    }
    else{
        console.log("No Geolocation attributes");
    }
});

const reverseGeoCode = async(position) => {
//    let placeAddress = "";
    let {latitude, longitude} = position.coords;
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MY_GOOGLE_API_KEY}`;
    try{
        const place = await fetch(URL);
        console.log(place.json());
    }
    catch(e){
        console.log("Exceptional error" + e);
    }
}

const mapFrameSrc = async(mapFrame, position) =>{
    let {latitude, longitude} = position.coords;
    const URL = `https://www.google.com/maps/embed/v1/place?key=${MY_GOOGLE_API_KEY}&q=${latitude}, ${longitude}`;
    mapFrame.src = URL;
}