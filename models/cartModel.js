let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Objectid = mongoose.Types.ObjectId

let cartSchema = new Schema({
    user_id: {
        type: Objectid,
        ref: "userdetails"
    },
    items: [{
        products: {
            type: Objectid,
            ref: "ProductData",
        },
        quantity: {
            type: Number,
            default: 1
        },
        productPrice: {
           type : Number,
            default: 0
        },
        productName: {
            type : String,
             
         },
        totalPrice: {
            type : Number,
             default: 0
         },

        date: {
            type: Date,
            default: Date.now
        }

    }],

    total: {
        type: Number,
        default: 0
    },
    subtotal : {
      type: Number,
      default:0
     
    }
   
},{timestamps : true});

module.exports = mongoose.model("cart", cartSchema);



