const express = require('express')
const router = express.Router()
const controller = require('../controllers/usercontroller')
const sessionControl = require('../middlewares/sessionControl')



// Home
router.get('/',controller.home)
router.get('/contact',sessionControl.userBlocked,controller.contact)
router.get('/about',sessionControl.userBlocked,controller.about)

// Login
router.get('/login',controller.userlogin)
router.get("/logout",controller.logout)
router.get('/signup',controller.signup)
router.post('/otp',controller.otp)
router.post('/resendotp',controller.resentOpt)
router.post('/doLogin',controller.doLogin)
router.post('/verifyotp',controller.verifyotp)
router.post('/verify-otp',controller.verify_otp)
router.post("/newPassword",controller.newPassword)
router.route('/forgot')
      .get(controller.forget)
      .post(controller.otpPage)

// Profile
router.get('/profile',controller.profile)
router.get('/editprofilepage/:id',controller.editProfile)
router.post('/updateProfile/:id',controller.changeProfile)

// Product
router.get('/products',sessionControl.userBlocked,controller.products)
router.get("/productdetails/:id",controller.productDetails)
router.post('/search',controller.searchProduct)

// Cart
router.get('/cart',sessionControl.userBlocked,controller.cart)
router.get("/addtocart/:id",controller.addtocart)
router.post("/deletefromCart/:id",controller.deleteFromCart)
router.post("/increment/:id",controller.cartIncrement)
router.post("/decrement/:id",controller.cartDecrement)

// Sort
router.get("/lowtoHigh",controller.sortLowtoHigh)
router.get("/hightoLow",controller.sortHightoLow)
router.get("/two-to-four",controller.two_to_five)
router.get("/four-to-six",controller.five_to_fifteen)
router.get("/six-to-eight",controller.fifteen_to_twentyfive)
router.get("/eight-to-thousand",controller.twentyfive_to_thirtyfive)
router.get("/above-thousand",controller.thirtyfive_to_above)

// Wishlist
router.get("/wishlist",controller.getWishlist)
router.post('/addtowishlist/:id',controller.addtowishlist)
router.post('/removewishlist/:id',controller.removeFromWishlist)
router.post("/addtocart/:id",controller.addtocart)

// Coupon
router.post('/applyCoupon',controller.applyCoupon)

// Order
router.get('/checkout',controller.checkout)
router.get('/order_success',controller.orderSuccessPage)
router.get('/viewOrder',controller.viewOrders)
router.get('/singleOrder/:id',controller.singleOrder)
router.post("/user_order",controller.order)
router.post('/verify_payment',controller.verifyPayment) 
router.post('/cancelOrder',controller.orderCancel)

// Address
router.post("/newAddress",controller.newAddress)
router.post("/changeAddress",controller.changeAddress)


module.exports = router