const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required: true,
    },
    image: {
        type: [String],
        required: true
    },
    block: {
        type: Boolean,
        default:false
    }


})

module.exports = BannerModel = mongoose.model('BannerData', bannerSchema);