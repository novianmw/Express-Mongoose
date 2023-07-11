const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name tidak boleh kosong'],
    }, 
    brand: {
        type: String,
        required: [true, 'Brand tidak boleh kosong'],
    },
    price: {
        type: Number,
        required: [true, 'harga tidak boleh kosong'],
    },
    category: {
        type: String,
        enum: ['Baju', 'Celana', 'Topi', 'Jaket', 'Aksesoris'],
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product