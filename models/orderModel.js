


const mongoose = require('mongoose');



const oderSchema = new mongoose.Schema({

    address : {
        type: Object,
        required: true,
        trim: true
      },
    userId : {
        type: String,
        required: true,
        trim: true
      }, 
    items : {
        type: Array,
        required: true,
        trim: true
        
      },
    paymentMethod : {
        type: String,
        required: true,
        trim: true
      },
    paymentStatus : {
        type: String,
        required: true,
        trim: true
      },
      orderStatus : {
        type: String,
        required: true,
        trim: true
      },
      
    totalProduct : {
        type: Number,
        required: true,
        trim: true
      },
    totalAmount : {
        type: Number,
        required: true,
        trim: true
      },
    deliveryDate : {
      type: String,
      trim: true
      }
},{ timestamps: true });


module.exports =  mongoose.model("orders", oderSchema)






































// const mongoose = require('mongoose')

// const orderSchema = new mongoose.Schema({
//     userId : {
//         type : objectId,
//         ref : "userdetails"
//     },
//     productId :{
//         type : objectId,
//         ref : "ProductData"
//     },
//     orderStatus : {
//         type : String,
//         default : "placed"
//     }
// },{timestamps : true})

// module.exports = orderModel = mongoose.model('orders',orderSchema);




