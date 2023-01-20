
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
    },
    block: {
        type: Boolean,
        default: false
    },
    address : {
        type : Array
    }



})

module.exports = mongoose.model('userdetails', userSchema);