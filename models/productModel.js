const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
    productName: {
        type: String,
        required: true,
    },
  
    discription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    block : {
        type : Boolean,
        default : false
    }
    



})

module.exports =  mongoose.model('ProductData', productSchema);