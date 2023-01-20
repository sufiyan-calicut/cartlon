const bcrypt = require("bcrypt");
// const session = require("express-session");
// const { Promise } = require("mongoose");
const userModel = require("../models/userModel");
// const createEror = require("http-errors");
const productModel = require("../models/productModel");
const adminModel = require("../models/adminMode");
const orderModel = require("../models/orderModel");
const couponModel = require("../models/coupenModel");
const BannerModel = require('../models/bannerModel');
// const { findOneAndDelete } = require("../models/productModel");

module.exports = {
    admin404: (req, res) => {
        res.render("admin/404");
    },

    admin: async (req, res) => {
        if (req.session.admin_loggedIn) {
            let adminName = req.session.adminName;
            let user = await userModel.find()
            let order = await orderModel.find()
            let sales = await orderModel.find({ orderStatus: "Delivered" })
            let total = 0;
            // eslint-disable-next-line no-unused-vars
            let online = 0;
            // eslint-disable-next-line no-unused-vars
            let cod = 0;
            order.forEach((o) => {
                if (o.paymentMethod == "Razorpay") {
                    online += 1;
                } else {
                    cod += 1
                }
            })
            sales.forEach((s) => {
                total += s.totalAmount
            })
            let lastOrder = await orderModel.find({ orderStatus: { $ne: "Pending" } }).limit(5).sort({ createdAt: -1 })
            res.render("admin/index", { adminName, user, order, total, lastOrder, cod, online });
        } else {
            let login_err = req.session.admin_loginErr
            res.render("admin/admin-login", { login_err });
            req.session.admin_loginErr = false;
        }
    },

    dologin: async (req, res) => {
        let adminData = await adminModel.find({})
        let admindata = adminData[0]
        let Email = req.body.email
        let Password = req.body.password
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

            res.render('admin/banner', { banners, index: 1, adminName: req.session.adminName })

        } catch (err) {
            console.log(err);
        }
    },

    addBannerPage: async (req, res) => {
        res.render("admin/addBanner", { adminName: req.session.adminName });
    },

    addBanner: async (req, res) => {
        try {
            const { bannerName } = req.body
            const image = req.files;
            /* eslint-disable */
            image.forEach(img => { });
            /* eslint-enable */
            const bannerimages = image != null ? image.map((img) => img.filename) : null
            const newBanner = BannerModel({
                bannerName,
                image: bannerimages,
            });
            await newBanner
                .save()
                .then(() => {
                    res.redirect("/admin/banner");
                })
                .catch((err) => {
                    console.log(err);

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
        let adminName = req.session.adminName;
        let user_view = await userModel.find({});
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
        /* eslint-disable */
        image.forEach((img) => { });
        /* eslint-enable */
        const productimages =
            image != null ? image.map((img) => img.filename) : null;
        const newProduct = productModel({
            productName,
            discription,
            price,
            category,
            image: productimages,
        });
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
        let adminName = req.session.adminName;
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
        /* eslint-disable */
        image.forEach((img) => { });
        /* eslint-enable */
        const productimages =
            image != null ? image.map((img) => img.filename) : null;
        if (req.files == '') {
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
        let adminName = req.session.adminName;
        await orderModel.deleteMany({ $and: [{ paymentMethod: "Razorpay" }, { orderStatus: "Pending" }] })
        let orders = await orderModel.find({});
        res.render("admin/orders", { orders, index: 1, adminName });
    },

    orderStatus: async (req, res) => {
        let orderId = req.body.orderId
        let status = req.body.status
        await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: status } })
        res.json({ response: true })
    },

    viewCoupon: async (req, res) => {
        let Coupons = await couponModel.find({});
        let adminName = req.session.adminName;
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
    },

    couponDeactivate: async (req, res) => {
        let id = req.params.id
        await couponModel.findByIdAndUpdate({ _id: id }, { $set: { status: "inActive" } })
        res.redirect('/admin/viewCoupon')
    },

    couponActivate: async (req, res) => {
        let id = req.params.id
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

    salesReport: async (req, res) => {
        let sales = await orderModel.find({ orderStatus: "Delivered" })
        let total = 0;
        sales.forEach((s) => {
            total = total + s.totalAmount
        })
        res.render("admin/salesReport", { sales, adminName: "sufi", total })
    }
};

