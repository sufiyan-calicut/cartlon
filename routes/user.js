const express = require('express')
const router = express.Router()
const controller = require('../controllers/usercontroller')
const sessionControl = require('../middlewares/sessionControl')



// GET

router.get('/',controller.home)
router.get('/login',controller.userlogin)
router.get('/signup',controller.signup)
router.get('/buy',controller.buy)
router.get('/products',sessionControl.userBlocked,controller.products)
router.get('/contact',sessionControl.userBlocked,controller.contact)
router.get('/about',sessionControl.userBlocked,controller.about)
router.get('/cart',sessionControl.userBlocked,controller.cart)
router.get("/logout",controller.logout)
router.get("/productdetails/:id",controller.productDetails)
router.get("/addtocart/:id",controller.addtocart)
router.get("/lowtoHigh",controller.sortLowtoHigh)
router.get("/hightoLow",controller.sortHightoLow)
router.get("/two-to-five",controller.two_to_five)
router.get("/five-to-fifteen",controller.five_to_fifteen)
router.get("/fifteen-to-twentyfive",controller.fifteen_to_twentyfive)
router.get("/twentyfive-to-thirtyfive",controller.twentyfive_to_thirtyfive)
router.get("/thirtyfive-to-above",controller.thirtyfive_to_above)
router.get("/wishlist",controller.getWishlist)
router.get('/checkout',controller.checkout)
router.get('/profile',controller.profile)
router.get('/editprofilepage/:id',controller.editProfile)
router.get('/order_success',controller.orderSuccessPage)
router.get('/viewOrder',controller.viewOrders)
router.get('/singleOrder/:id',controller.singleOrder)


// POST 

router.post('/otp',controller.otp)
router.post('/resendotp',controller.resentOpt)
router.post('/doLogin',controller.doLogin)
router.post('/verifyotp',controller.verifyotp)
router.post('/verify-otp',controller.verify_otp)
router.post('/search',controller.searchProduct)
router.post("/newPassword",controller.newPassword)
router.post("/addtocart/:id",controller.addtocart)
router.post('/addtowishlist/:id',controller.addtowishlist)
router.post('/removewishlist/:id',controller.removeFromWishlist)
router.post("/deletefromCart/:id",controller.deleteFromCart)
router.post("/increment/:id",controller.cartIncrement)
router.post("/decrement/:id",controller.cartDecrement)
router.post("/newAddress",controller.newAddress)
router.post("/changeAddress",controller.changeAddress)
router.post("/user_order",controller.order)
router.post('/updateProfile/:id',controller.changeProfile)
router.post('/verify_payment',controller.verifyPayment) 
router.post('/applyCoupon',controller.applyCoupon)
router.post('/cancelOrder',controller.orderCancel)


// .............................New model ...........................
router.route('/forgot')
      .get(controller.forget)
      .post(controller.otpPage)
// router.get('/wishlist',controller.wishlist)





module.exports = router