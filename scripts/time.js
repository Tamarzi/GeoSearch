const currentTime = () => {
    const date = new Date();
    let time = "";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    time = hours + ":" + minutes + ":" + seconds;
    return time;
}

const gmt = () => {
    const date = new Date();
    const offsetTime = date.getTimezoneOffset()/60;
    return -offsetTime;
}

export {currentTime, gmt};