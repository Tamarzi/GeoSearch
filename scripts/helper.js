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
export { mapLoaderSpinVisible, mapLoaderSpinHidden, searchButtonSpinOn, searchButtonSpinOff };