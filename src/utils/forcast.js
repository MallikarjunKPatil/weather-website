const request = require('request')

const forcast = (latitude, longitude, callback) => {

    let url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=CaQwyxsstnmr1Q9jRAcyrfJP6wQcMXJ9&q=${encodeURIComponent(longitude)}%2C${encodeURIComponent(latitude)}`
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            console.log('Unable to fetch the location');
        }

        else {
            url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${body.Key}?apikey=CaQwyxsstnmr1Q9jRAcyrfJP6wQcMXJ9&metric=true`
            const AddressKey = body.Key
            request({ url, json: true }, (error, { body }) => {
                if (error) {
                    callback('Unable to connect to weather service!', undefined)
                } else if (body.Code === 400) {
                    callback('Unable to find location', undefined)
                } else if (body.Code === 'ServiceUnavailable') {
                    callback('Weather Service is Unavailable', undefined)
                }
                else {
                    const weatherSummary = body.Headline.Text

                    const url = `http://dataservice.accuweather.com/currentconditions/v1/${AddressKey}?apikey=CaQwyxsstnmr1Q9jRAcyrfJP6wQcMXJ9`

                    request({ url, json: true }, (error, { body }) => {
                        if (error) {
                            callback('Unable to connect to weather service!', undefined)
                        } else if (body.Code === 400) {
                            callback('Unable to find location', undefined)
                        } else if (body.Code === 'ServiceUnavailable') {
                            callback('Weather Service is Unavailable', undefined)
                        }
                        else {
                            callback(undefined, {
                                summary: weatherSummary,
                                temp: body[0].Temperature.Metric.Value
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = forcast