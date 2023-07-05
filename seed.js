const mongoose = require('mongoose')
const Product = require('./models/product')

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('MongoDB connected')
    }).catch((error) => {
        console.log('MongoDB connection failed', error)
    })

const seedProduct = [
    {
        "name": "Kemeja Flanel",
        "brand": "Hollister",
        "price": 750000,
        "color": "biru muda",
        "size": "M",
    },
    {
        "name": "Sweater",
        "brand": "Gap",
        "price": 650000,
        "color": "merah muda",
        "size": "XL"
    },
    {
        "name": "Baju Renang",
        "brand": "Speedo",
        "price": 500000,
        "color": "biru tua",
        "size": "S"
    },
    {
        "name": "Rompi",
        "brand": "Zara",
        "price": 850000,
        "color": "abu-abu",
        "size": "L"
    },
    {
        "name": "Jas",
        "brand": "Hugo Boss",
        "price": 4500000,
        "color": "hitam",
        "size": "XL"
    }
]

Product.insertMany(seedProduct).then((result) => {
    console.log('seed product success',result)
}).catch((error) => {
    console.log('seed product failed', error)
})
