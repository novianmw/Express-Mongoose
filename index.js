const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('MongoDB connected')
    }).catch((error) => {
        console.log('MongoDB connection failed', error)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000')
})