const autocomplete = {
    currentFocus: -1,

    dropDown(inp, searchQueryResults){
        this.closeAllLists();
       
        const autoComList = document.createElement("div");
        autoComList.setAttribute("id", "autocomplete-lists");
        autoComList.setAttribute("class", "autocomplete-item");

        searchQueryResults.map((result) => {
            const autoComDiv = document.createElement("div");
            
            autoComDiv.innerHTML += "<span><i></i></span>";
            autoComDiv.innerHTML += "<span><strong>" + result.displayString.substr(0, inp.value.length) + "</strong>" + result.displayString.substr(inp.value.length) + "</span>"

            autoComDiv.addEventListener("click", (e) => {
                inp.value = e.target.textContent;
                this.closeAllLists();
            });

            autoComList.appendChild(autoComDiv);

        });

        this.formContainer = document.getElementById("form-container");
        this.formContainer.appendChild(autoComList);
        //Or evt.target.parentNode.appendChild(autoComList);
    },

    keyUpDown(evt){
        this.x = document.getElementById("autocomplete-lists");
        if(this.x)
            this.x = this.x.getElementsByTagName("div");    
        
        if(evt.key == "ArrowDown"){
            this.currentFocus++;
            this.currentFocus = this.currentActiveCheck(x, this.currentFocus);     //using object and classes would have prevented this mistake
            this.removeActiveItem(this.x);
            this.x[this.currentFocus].classList.add("autocomplete-active");
        }
        else if(evt.key == "ArrowUp"){  //Others: ArrowLeft & ArrowRight
            this.currentFocus--;
            this.currentFocus = this.currentActiveCheck(x, this.currentFocus);
            this.removeActiveItem(x);
            this.x[this.currentFocus].classList.add("autocomplete-active");
        }
    },

    closeAllLists(){
        const autoComListClass = document.getElementsByClassName("autocomplete-item");
        let i, len = autoComListClass.length;
        for(i = 0; i < len; i++){
            if(autoComListClass[i])
                this.formContainer.removeChild(autoComListClass[i]);
        }
    },
    
    currentActiveCheck(){
    
        if(this.currentFocus >= this.x.length)
            this.currentFocus = 0;
        else if(this.currentFocus < 0)
            this.currentFocus = this.x.length - 1;

        return this.currentFocus;
    },

    removeActiveItem(){
        let i, len = this.x.length;
        for(i = 0; i < len; i++)
            this.x[i].classList.remove("autocomplete-active");
    }
}

export {autocomplete};