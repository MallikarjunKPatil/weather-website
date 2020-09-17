const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forcast = require('./utils/forcast')


const app = express()
const port = process.env.PORT || 3000

//Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Mallikarjun Patil'
    })

})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Mallikarjun Patil'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Help Page',
        name: 'Mallikarjun Patil'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address !'
        })
    }
    geocode(req.query.address, (error,{longitude,latitude,location}={}) => {
        if(error){
            return res.send({
                error
            })
        }
        forcast(longitude,latitude, (error,forcastData) => {
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                forcast: forcastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mallikarjun Patil',
        error: 'Help Article Not Found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mallikarjun Patil',
        error: 'Page Not Found'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})