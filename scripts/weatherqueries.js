const keys = {
    openWeatherKey: 'b2d92d739223cff08ee593caea6203b6'
}

const weatherQueriesWithCoord = async(coordinates) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${keys.openWeatherKey}`;

    const response = await fetch(URL, {
        "Method": "GET"
    });
    
    const weatherData = await response.json();

    const temperature = weatherData.main.temp;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const iconId = weatherData.main.icon;
    const iconName = weatherData.main.description;

    return {temperature, wind, humidity, pressure, iconId, iconName};
};

const weatherQueriesWithPlaceName = async(placeName) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${place.city},${place.state},${place.country}&appid=${}`;
    const response = await fetch(URL, {
        "Method": "GET"
    });
    
    const weatherData = await response.json();

    const temperature = weatherData.main.temp;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const iconId = weatherData.main.icon;
    const iconName = weatherData.main.description;

    return {temperature, wind, humidity, pressure, iconId, iconName};
}

export {weatherQueriesWithCoord, weatherQueriesWithPlaceName};