const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer')
// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose");
require('dotenv').config()
const db = require('./configuration/connection')

const homeRoute = require('./routes/user')
const adminRoute = require('./routes/admin');
const app = express()
/*eslint-disable */
app.set('views',path.join(__dirname,"/views"))
app.set('view engine',"ejs")

app.use(express.static(path.join(__dirname,"public")))
db.connect()
/*eslint-enable */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret:"secret",cookie:{maxAge:600000},saveUninitialized:true,resave:true}))

app.use((req,res,next)=>{
    res.header('Cache-Control','private,no-cache,no-store,must-revalidate');
    next();
  });

//filestorage
const fileStorage=multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,'public/thumbnails/')
  },
  filename:(req,file,callback)=>{
    callback(null, file.fieldname +"_" + Date.now() + path.extname(file.originalname))
  
  }
})

app.use(multer({storage: fileStorage}).array("image", 10));
app.use('/',homeRoute)
app.use('/admin',adminRoute)
const PORT = 4000
app.listen(PORT,console.log(`server started on port ${PORT}`))
