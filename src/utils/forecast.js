const request = require('./request-json')

const forecast = (latitude, longitude, callback) => {
    if (!process.env.DARKSKY_API_KEY) return callback('Weather service is not configured')
    const url = 'https://api.darksky.net/forecast/' + encodeURIComponent(process.env.DARKSKY_API_KEY) + '/' + encodeURIComponent(latitude) + ','+ encodeURIComponent(longitude) + '?units=si'
    request({ url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        }else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const temperature = body.currently.temperature
            const  rain = body.currently.precipProbability
            callback(undefined, body.daily.data[0].summary + " It is currently " + temperature + " degrees out. The high today is " + body.daily.data[0].temperatureHigh + " with a low of " + body.daily.data[0].temperatureLow +". There is a " + rain + "% chance of rain.")
        }
    })
}

module.exports  = forecast
