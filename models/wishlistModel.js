const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const wishlistSchema = new mongoose.Schema({

    user:{
        type: Objectid,
        ref: 'userdetails'
    },
    products: {
        type: [Objectid], 
        ref: 'ProductData',
        default:[]
    },
})

module.exports =  mongoose.model("Wishlist", wishlistSchema)