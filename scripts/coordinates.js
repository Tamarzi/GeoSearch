const coordinates = () => {
    return new Promise((resolve, reject) => {
        let coordinates = {};
        navigator.geolocation.watchPosition((position) => {
            coordinates = position.coords;
            resolve(coordinates);
        },
        (error) => reject(error));
    });
}

export default coordinates;