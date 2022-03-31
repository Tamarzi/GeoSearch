
const celsiusToFahrenheit = (celsius) => {
    if(celsius)
        return (9 * parseInt(celsius))/5 + 32;
    else
        throw "Value is not a Celsius value";
}

const fahrenheitToCelsius = (fahrenheit) => {
    if(fahrenheit)
        return (parseInt(fahrenheit) - 32) * (5/9);
    else
        throw "Value is not a fahrenheit value";
}

export {celsiusToFahrenheit, fahrenheitToCelsius};