const bcrypt = require("bcrypt");
const session = require("express-session");
const { Promise } = require("mongoose");
const userModel = require("../models/userModel");
const createEror = require("http-errors");
const productModel = require("../models/productModel");
const adminModel = require("../models/adminMode");
const orderModel = require("../models/orderModel");
const couponModel = require("../models/coupenModel");
const BannerModel = require('../models/bannerModel');
const { findOneAndDelete } = require("../models/productModel");







module.exports = {
    admin404: (req, res) => {
        res.render("admin/404");

    },
    admin: async (req, res) => {
        if (req.session.admin_loggedIn) {
            adminName = req.session.adminName;
            let user = await userModel.find().length
            console.log(user);

            res.render("admin/index", { adminName ,user});
        } else {
            login_err = req.session.admin_loginErr
            res.render("admin/admin-login", { login_err });
            req.session.admin_loginErr = false;
        }
    },
    dologin: async (req, res) => {
        let adminData = await adminModel.find({})
        let admindata = adminData[0]
        Email = req.body.email
        Password = req.body.password

        if (Email == admindata.email) {

            let pass = await bcrypt.compare(Password, admindata.password)
            if (pass) {
                req.session.admin_loggedIn = true;
                req.session.adminName = req.body.Name;
                res.redirect("/admin");
            } else {
                req.session.admin_loginErr = true;
                res.redirect("/admin");
            }
        } else {
            req.session.admin_loginErr = true;
            res.redirect("/admin");
        }
    },
    signout: (req, res) => {
        req.session.destroy();
        res.redirect("/admin");
    },
    viewBanner: async (req, res) => {



        try {
            const banners = await BannerModel.find({})
            console.log(banners)
            res.render('admin/banner', { banners, index: 1, adminName: req.session.adminName })

        } catch (err) {
            console.log(err);
        }

    },
    addBannerPage: async (req, res) => {
        res.render("admin/addBanner", { adminName: req.session.adminName });
    },
    addBanner: async (req, res) => {
        console.log(req.body, "body");
        console.log(req.files, "fiels");


        try {
            const { bannerName } = req.body

            const image = req.files;
            image.forEach(img => { });
            console.log(image);
            const bannerimages = image != null ? image.map((img) => img.filename) : null

            const newBanner = BannerModel({
                bannerName,
                image: bannerimages,
            });
            console.log(newBanner)

            await newBanner
                .save()
                .then(() => {
                    res.redirect("/admin/banner");
                })
                .catch((err) => {
                    console.log(err.message);
                    res.redirect("/admin/addBanner");
                });

        } catch (err) {
            console.log(err);
        }




    },
    deleteBanner: async (req, res) => {

        let bannerId = req.params.id
        await BannerModel.findOneAndDelete({ _id: bannerId }).then(() => {
            res.redirect('/admin/banner')
        })

    },
    blockBanner: async (req, res) => {
        let banner = req.params.id
        await BannerModel.findOneAndUpdate({ _id: banner }, { $set: { block: true } }).then(() => {
            res.redirect('/admin/banner')
        })
    },
    unblockBanner: async (req, res) => {
        let banner = req.params.id
        await BannerModel.findOneAndUpdate({ _id: banner }, { $set: { block: false } }).then(() => {
            res.redirect('/admin/banner')
        })
    },


    viewUsers: async (req, res) => {
        adminName = req.session.adminName;
        let user_view = await userModel.find({});
        console.log(user_view, "all users details");
        res.render("admin/view-user", { user_view, index: 1, adminName });
    },
    blockUser: async (req, res) => {
        let userId = req.params.id;
        await userModel.updateOne({ _id: userId }, { $set: { block: true } });
        res.redirect("/admin/users");
    },
    unblockUser: async (req, res) => {
        let userId = req.params.id;
        await userModel.updateOne({ _id: userId }, { $set: { block: false } });
        res.redirect("/admin/users");
    },
    addProductview: async (req, res) => {
        res.render("admin/add-product", { adminName: req.session.adminName });
    },
    addproduct: async (req, res) => {
        const productName = req.body.productName;
        const discription = req.body.discription;
        const price = req.body.price;
        const category = req.body.category;

        const image = req.files;
        image.forEach((img) => { });
        console.log(image);
        const productimages =
            image != null ? image.map((img) => img.filename) : null;
        console.log(productimages);


        const newProduct = productModel({
            productName,
            discription,
            price,
            category,
            image: productimages,
        });
        console.log(newProduct, "new product details");

        await newProduct
            .save()
            .then(() => {
                res.redirect("/admin/addproduct");
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/addproduct");
            });
    },

    viewProduct: async (req, res) => {
        let view_product = await productModel.find({});
        adminName = req.session.adminName;
        res.render("admin/view-product", { view_product, index: 1, adminName });
    },

    editProduct: async (req, res) => {
        const id = req.params.id;
        let product = await productModel.findOne({ _id: id });
        res.render("admin/edit-product", { product, adminName: req.session.adminName });
    },

    updateProduct: async (req, res) => {

        const productName = req.body.productName;
        const discription = req.body.discription;
        const price = req.body.price;
        const category = req.body.category;
        const { id } = req.params

        const image = req.files;
        image.forEach((img) => { });
        console.log(image);
        const productimages =
            image != null ? image.map((img) => img.filename) : null;

        if (req.files == '') {
            // image.forEach((img) => { });
            // console.log(image);
            // const productimages = image != null ? image.map((img) => img.filename) : null;
            // console.log(productimages);


            await productModel.updateOne(
                { _id: id },
                {
                    $set: {
                        productName,
                        discription,
                        price,
                        category
                    }
                }
            );
        } else {

            await productModel.updateOne(
                { _id: id },
                {
                    $set: {

                        productName,
                        discription,
                        price,
                        category,
                        image: productimages,
                    }
                }
            );
        }
        res.redirect("/admin/viewproduct");
    },
    unblockProduct: async (req, res) => {
        let productId = req.params.id;
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { block: false } });
        res.redirect("/admin/viewproduct");
    },
    blockProduct: async (req, res) => {
        let productId = req.params.id;
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { block: true } });
        res.redirect("/admin/viewproduct");
    },
    orders: async (req, res) => {

        adminName = req.session.adminName;
        let orders = await orderModel.find({});

        console.log(orders, "<= orders");

        res.render("admin/orders", { orders, index: 1, adminName });

    },
    orderStatus: async (req, res) => {
        let orderId = req.body.orderId
        let status = req.body.status

        await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: status } })
    },
    viewCoupon: async (req, res) => {
        let Coupons = await couponModel.find({});
        expirydate = Coupons.expiryDate
        createdDate = Coupons.createdDate


        adminName = req.session.adminName;
        res.render("admin/viewCoupon", { Coupons, index: 1, adminName });

    },

    addCouponPage: async (req, res) => {
        res.render("admin/addCoupon", { adminName: req.session.adminName });
    },
    addCoupon: async (req, res) => {

        const { couponName, discount, maximumDiscount, minimumAmount, expiryDate } = req.body



        const coupon = new couponModel({
            couponName,
            discount,
            maximumDiscount,
            minimumAmount,
            expiryDate
        })


        await coupon
            .save()
            .then(() => {
                res.redirect("/admin/addCoupon")
            })


        console.log("req =>", req.body);
    },
    couponDeactivate: async (req, res) => {

        id = req.params.id

        await couponModel.findByIdAndUpdate({ _id: id }, { $set: { status: "inActive" } })

        res.redirect('/admin/viewCoupon')

    },
    couponActivate: async (req, res) => {
        id = req.params.id
        await couponModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Active" } })

        res.redirect('/admin/viewCoupon')
    },
    deleteCoupon: async (req, res) => {
        let Coupon_id = req.params.id
        await couponModel.findByIdAndDelete({ _id: Coupon_id })
        res.redirect('/admin/viewCoupon')

    },
    editCoupon: async (req, res) => {
        let Coupon_id = req.params.id
        let coupon = await couponModel.findOne({ _id: Coupon_id })
        res.render("admin/editCoupon", { coupon })
    },
    updateCoupon: async (req, res) => {
        const { couponName, discount, maximumDiscount, minimumAmount, expiryDate } = req.body

        let Coupon_id = req.params.id



        await couponModel.findByIdAndUpdate({ _id: Coupon_id },
            {
                $set: {
                    couponName,
                    discount,
                    maximumDiscount,
                    minimumAmount,
                    expiryDate
                }
            })
        res.redirect('/admin/viewCoupon')

    },
    salesReport : async (req,res) => {
        let sales = await orderModel.find({orderStatus:"Delivered"})
        let total= 0 ;
          sales.forEach((s)=>{
            total = total + s.totalAmount
          })
        console.log(typeof(total),"",total,"",sales);
        res.render("admin/salesReport",{sales,adminName:"sufi",total})
    }



};

