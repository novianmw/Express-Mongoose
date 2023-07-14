const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const ErrorHandler = require('./utils/ErrorHandler')

// models
const Product = require('./models/product')
const Garment = require('./models/garment')

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('MongoDB connected')
    }).catch((error) => {
        console.log('MongoDB connection failed', error)
    })

app.set('views', path.join(__dirname, 'views')) // path link ke folder views
app.set('view engine', 'ejs') // file ejs
app.use(express.urlencoded({ extended: true })) // untuk membaca data dari form
app.use(methodOverride('_method')) // untuk mengubah method POST atau GET menjadi Update atau DELETE

// middleware pengganti try catch 
function wrapAsync(fn) { 
    return function(req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}


// OPENING (landing page)
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>' + '<h2>Silahkan ke menu di bawah ini</h2>' + '<a href="/products">Products</a> ' + '<a href="/garments">garments</a>')
    
})


// GET list GARMENT
app.get('/garments', wrapAsync(async (req,res) => {
    const garments = await Garment.find({})
    res.render('garments/index', { garments })
}))
// GET list PRODUCTS
app.get('/products', async (req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category})
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})


// GET form for create new garment
app.get('/garments/create', (req, res) => {
    res.render('garments/create')
})
// GET form for create new product
app.get('/products/create', (req, res) => {
    res.render('products/create')
})


// GET form for create new product in garment
// /garments/:garment_id/product/create
app.get('/garments/:garment_id/products/create', (req, res) => {
    const { garment_id } = req.params
    res.render('products/create', { garment_id })
})

// POST create new product in garment
// /garments/:garment_id/products
app.post('/garments/:garment_id/products', wrapAsync(async (req, res) => {
    const { garment_id } = req.params
    const garment = await Garment.findById(garment_id)
    const product = new Product(req.body)
    garment.products.push(product)
    product.garment = garment
    await garment.save()
    await product.save()
    res.redirect(`/garments/${garment_id}`)
}))





// POST create new garment from form create
app.post('/garments', wrapAsync(async (req, res) => {
    const garment = new Garment(req.body)
    await garment.save()
    res.redirect(`/garments`)
}))
// POST create new product from form create
app.post('/products', wrapAsync(async (req, res) => {
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)
}))

// GET detail garment berdasarkan ID garment
app.get('/garments/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findById(id).populate('products') // populate untuk mengambil data dari product
    res.render('garments/show', { garment })
}))
// GET detail product berdasarkan ID product
app.get('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params
        const product = await Product.findById(id).populate('garment')
        res.render('products/show', { product })            
}))

// get detail garment di form edit
app.get('/garments/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findById(id)
    res.render('garments/edit', { garment })
}))
// Get detail product di form edit
app.get('/products/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params
        const product = await Product.findById(id)
        res.render('products/edit', { product })
}))

// Update garment yang di pilih form edit
app.put('/garments/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const garment = await Garment.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/garments/${garment._id}`)
}))

// Update product yang di pilih form edit
app.put('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
        res.redirect(`/products/${product._id}`)
}))

// Delete garment yang di pilih
app.delete('/garments/:garment_id', wrapAsync(async (req, res) => {
    const { garment_id } = req.params
    await Garment.findOneAndDelete({_id: garment_id})
    res.redirect('/garments')
}))
// Delete product yang di pilih
app.delete('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.redirect('/products')
}))

const validatorHandler = err => {
    err.status = 400
    err.message = Object.values(err.errors).map(item => item.message)
    return new ErrorHandler(err.message, err.status)
}

// for Middleware Error Handler
app.use((err, req, res, next) => {
    console.dir(err)
    if (err.name === 'ValidationError') err = validatorHandler(err)
    if (err.name === 'CastError') {
        err.status = 404
        err.message = 'Product tidak ditemukan'
    }
    next(err)
})

// error router wrong path
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong !' } = err
    res.status(status).send(message)
})


app.listen(3000, () => {
    console.log('Server is running on http://127.0.0.1:3000')
})