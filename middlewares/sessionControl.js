const userModel = require('../models/userModel')

module.exports={
    adminSession:(req,res,next)=>{
        if(req.session.adminLogged){
            next()
        }else{
            res.redirect('/admin')
        }
    },
    userSession:(req,res,next)=>{
        if(req.session.loggedIn){
            next()
        }else{
            res.redirect('/signin')
        }
    },
    userBlocked:async (req,res,next)=>{
     let id = req.session.userID
     if(id){

     let user = await userModel.findById({_id:id})
     console.log(user.block);

     if(user.block){
       
        req.session.destroy()
                res.redirect('/')
     }else{
       
        next()
     }
    
     }else{
       
        next()
     }
    
    },

}