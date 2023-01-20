const mongoose = require('mongoose')
// mongoose.connect("mongodb+srv://Cartlon:<1234>@cluster0.uaktydn.mongodb.net/?retryWrites=true&w=majority")
// const db = mongoose.connection;
// db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected to Mongoose'))
// mongodb+srv://adarsh:09sBQW7NRXgSmxUH@cluster0.g2edsqh.mongodb.net/cluster0?retryWrites=true&w=majority
module.exports.connect=function(){
    mongoose.connect("mongodb+srv://Cartlon:1234@cluster0.uaktydn.mongodb.net/cluster0?retryWrites=true&w=majority",()=>{
    console.log("Mogodb is connected");
},
e=>console.error(e)
)
}