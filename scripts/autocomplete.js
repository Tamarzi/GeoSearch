const autocomplete = () => {
    const inp = document.getElementById("search-bar");

    let currentFocus = -1;
    inp.addEventListener("input", async(evt) => {
        let queryValue = evt.target.value;
        closeAllLists();
        const reqObj = {
            apiKey: "W4SPlNvla5G56Tu2yD7AevlIAdqRokSI",
            limit: 9,
            feedback: false,
            collection: ["address", "adminArea", "airport", "poi", "franchise"],
        }

        const URL = `http://www.mapquestapi.com/search/v3/prediction?key=${reqObj.apiKey}&limit=${reqObj.limit}&collection=${reqObj.collection}&q=${queryValue}`;

        const requestPlaces = await fetch(URL, {"Method": "GET"});
        const data = await requestPlaces.json();

        const autoComList = document.createElement("div");
        autoComList.setAttribute("id", "autocomplete-lists");
        autoComList.setAttribute("class", "autocomplete-item");

        data.results.map((result) => {
            const autoComDiv = document.createElement("div");
            
            autoComDiv.innerHTML += "<span><i></i></span>";
            autoComDiv.innerHTML += "<span><strong>" + result.displayString.substr(0, queryValue.length-1) + "</strong>" + result.displayString.substr(queryValue.length) + "</span>"

            autoComDiv.addEventListener("click", (e) => {
                inp.value = e.target.textContent;
                closeAllLists();
            });

            autoComList.appendChild(autoComDiv);

        });

        const searchBarContainer = document.getElementById("form-container");
        searchBarContainer.appendChild(autoComList);
        //Or evt.target.parentNode.appendChild(autoComList);
    });

    inp.addEventListener("keydown", (evt) => {
        let x = document.getElementById("autocomplete-lists");
        if(x)
            x = x.getElementsByTagName("div");    
        
        if(evt.key == "ArrowDown"){
            currentFocus++;
            currentFocus = currentActiveCheck(x, currentFocus);
            removeActiveItem(x);
            x[currentFocus].classList.add("autocomplete-active");
        }
        else if(evt.key == "ArrowUp"){  //Others: ArrowLeft & ArrowRight
            currentFocus--;
            currentFocus = currentActiveCheck(x, currentFocus);
            removeActiveItem(x);
            x[currentFocus].classList.add("autocomplete-active");
        }
    });

}

const closeAllLists = () => {
    const formContainer = document.getElementById("form-container");
    const autoComListClass = document.getElementsByClassName("autocomplete-item");
    let i, len = autoComListClass.length;
    for(i = 0; i < len; i++){
        formContainer.removeChild(autoComListClass[i]);
    }
}

const currentActiveCheck = (x, currentFocus) => {
    
    if(currentFocus >= x.length)
        currentFocus = 0;
    else if(currentFocus < 0)
        currentFocus = x.length - 1;

    return currentFocus;
}

const removeActiveItem = (x) => {
    let i;
    for(i = 0; i < x.length; i++)
        x[i].classList.remove("autocomplete-active");
}

export {autocomplete};