const celsiusToFahrenheit = (celsius) => {
    return (9 * celsius)/5 + 32;
}

const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * (5/9);
}

export {celsiusToFahrenheit, fahrenheitToCelsius};