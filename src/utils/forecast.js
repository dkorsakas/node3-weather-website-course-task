const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/4aa1f7901157a0ab9d6fb653cbc0efb6/' + encodeURIComponent(latitude) + ','+ encodeURIComponent(longitude) + '?units=si'
    request({ url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        }else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const temperature = body.currently.temperature
            const  rain = body.currently.precipProbability
            callback(undefined, body.daily.data[0].summary + " It is currently " + temperature + " degrees out. There is a " + rain + "% chance of rain.")
        }
    })
}

module.exports  = forecast