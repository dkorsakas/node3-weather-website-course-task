const request = require('./request-json')


const geocode = (address, callback) => {
    if (!process.env.MAPBOX_ACCESS_TOKEN) return callback('Location service is not configured')
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=' + encodeURIComponent(process.env.MAPBOX_ACCESS_TOKEN) + ''
    
    request({url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('unable to connnect to location services', undefined)
        } else if (body.features.length === 0) {
            callback('unable to find location. try another search', undefined)
        } else {
            callback(undefined, {
                latitude:   body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode
