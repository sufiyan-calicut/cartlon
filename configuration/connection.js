const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Cartlon:1234@cluster0.uaktydn.mongodb.net/cluster0?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))