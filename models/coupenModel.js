const mongoose = require('mongoose');

const coupenSchema = new mongoose.Schema({
    couponName: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    maximumDiscount: {
        type: Number,
        required: true
    },
    minimumAmount: {
        type: Number,

    },
    expiryDate:
    {
        type: Date,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Active'
    }
})

module.exports = coupenModel = mongoose.model('CoupenData', coupenSchema);