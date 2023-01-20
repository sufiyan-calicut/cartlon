const mongoose = require('mongoose');
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

module.exports = mongoose.model('BannerData', bannerSchema);
