const mapLoaderSpinVisible = () => {
    document.querySelector("#main > .loaderspin").style.visibility = "visible";
}

const mapLoaderSpinHidden = () => {
    document.querySelector("#main > .loaderspin").style.visibility = "hidden";
}

const searchButtonSpinOn = () => {
    document.getElementsByClassName("submit")[0].style.display = "none";
    document.getElementsByClassName("spinner")[0].style.display = "inline-block";
}

const searchButtonSpinOff = () => {
    document.getElementsByClassName("submit")[0].style.display = "inline-block";
    document.getElementsByClassName("spinner")[0].style.display = "none";
}
const closeToolTip = () => {
    document.querySelector(".tooltip > #tooltiptext").style.visibility = "hidden";
}
const mouseOverToolTip = () => {
    document.querySelector(".tooltip").addEventListener("mouseover", (evt) => {
        document.getElementById("tooltiptext").style.visibility = "visible";
    });
}
const mouseLeaveToolTip = () => {
    document.querySelector(".tooltip").addEventListener("mouseleave", (evt) => {
        document.getElementById("tooltiptext").style.visibility = "hidden";
    });
}
export { mapLoaderSpinVisible, mapLoaderSpinHidden, searchButtonSpinOn, searchButtonSpinOff, closeToolTip, mouseOverToolTip, mouseLeaveToolTip };