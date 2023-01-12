const express = require('express')
const router = express.Router()
const admin_controller = require('../controllers/admin-controller')
const sessionController = require('../middlewares/sessionControl')


// get 
router.get('/addBanner',admin_controller.addBannerPage)
router.get('/',admin_controller.admin)
router.get('/signout',admin_controller.signout)
router.get('/banner',admin_controller.viewBanner)
router.get('/users',admin_controller.viewUsers)
router.get('/addproduct',admin_controller.addProductview)
router.get('/viewproduct',admin_controller.viewProduct)
router.get('/editProduct/:id',admin_controller.editProduct)
router.get("/orders",admin_controller.orders)
router.get('/viewCoupon',admin_controller.viewCoupon)
router.get("/salesReport",admin_controller.salesReport)
router.get("/deleteCoupon/:id",admin_controller.deleteCoupon)
router.get("/editCoupon/:id",admin_controller.editCoupon)




// new method

router.route('/addCoupon')
      .get(admin_controller.addCouponPage)
      .post(admin_controller.addCoupon)

// post

router.post('/doLogin',admin_controller.dologin)
router.post('/block/:id',admin_controller.blockUser)

router.post('/unblock/:id',admin_controller.unblockUser)
router.post('/addproduct',admin_controller. addproduct)
router.post('/product_unblock/:id',admin_controller.unblockProduct)
router.post('/product_block/:id',admin_controller.blockProduct)
router.post('/updateProduct/:id',admin_controller.updateProduct)
router.post('/status_change/',admin_controller.orderStatus)
router.post('/couponDeactivate/:id',admin_controller.couponDeactivate)
router.post('/couponActivate/:id',admin_controller.couponActivate)
router.post('/editCoupon/:id',admin_controller.updateCoupon)
router.post('/addBanner',admin_controller.addBanner)
router.post('/editBanner/:id',admin_controller.deleteBanner)
router.post('/bannerBlock/:id',admin_controller.blockBanner)
router.post('/bannerUnblock/:id',admin_controller.unblockBanner)







// // router.get('/404',admin.admin404)


module.exports = router