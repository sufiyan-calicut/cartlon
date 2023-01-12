const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const wishlistModel = require("../models/wishlistModel");
const mongoose = require('mongoose');
const { create } = require("../models/userModel");
const Razorpay = require('razorpay');
const bannerModel = require("../models/bannerModel");
const couponModel = require("../models/coupenModel")
const { response } = require("express");
const crypto=require('crypto');

const ObjectId = mongoose.Types.ObjectId

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "cartlonswisswatches@gmail.com",
    pass: "xaiqfazinyyrdqkq",
  },
});

var instance = new Razorpay({
  key_id: "rzp_test_JNLKfIjgS0l3it",
  key_secret: "gBBWwEBxMziyqovi7vJz27Bo",
}); 

var UserName;
var Email;
var Phone;
var Password;






module.exports = {
  home: async (req, res) => {
    let logged = req.session.loginStatus;
    let userId = req.session.userID
    let products = await productModel.find({ block: false }).limit(8);
    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let banner = await bannerModel.find({ block: false })
    console.log(banner);

    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }
    // console.log(wishlistItems, "<<<<<<<<");
    res.render("user/home", { logged, products, wishlistItems, banner });
  },

  doSignUp: async (req, res) => {
    const name = req.body.Name;
    const email = req.body.Email;
    const phone = req.body.Phone;
    const password = req.body.Password;

    const olduser = await userModel.findOne({ email: req.body.Email });
    if (olduser) {
      res.redirect("/signup");
    } else {
      const newUser = new userModel({
        name,
        email,
        phone,
        password,
      });
      newUser
        .save()
        .then(() => {
          console.log("new user added");
          res.redirect("/");
        })
        .catch((ee) => {
          console.log(ee, "err");
        });
    }
  },

  userlogin: (req, res) => {
    if (req.session.loginStatus) {
      res.redirect("/");
    } else {
      let user_loginErr = req.session.user_loginErr;
      res.render("user/signin", { user_loginErr });
      req.session.destroy();
    }
  },

  signup: (req, res) => {
    res.render("user/signup", { signup_err: req.session.signup_err });
    req.session.destroy();
  },

  doLogin: async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    req.session.user_loginErr = false;

    let user_db = await userModel.findOne({
      $and: [{ email: email }, { block: false }],
    });
    console.log(user_db);
    if (!user_db) {
      req.session.user_loginErr = true;
      return res.redirect("/login");
    }
    console.log(req.body);

    const isMatch = await bcrypt.compare(password, user_db.password);
    if (!isMatch) {
      req.session.user_loginErr = true;
      return res.redirect("/login");
    } else {
      req.session.user = user_db;
      req.session.userID = user_db.id;

      req.session.loginStatus = true;

      res.redirect("/");
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  otp: async (req, res) => {
    UserName = req.body.Name;
    phoneNumber = req.body.phoneNumber;
    Email = req.body.Email;


    console.log("user email", Email);

    Password = req.body.Password;
    console.log(req.body, "ajnas");
    // const { user_name, email, password, confirm } = req.body;
    const user = await userModel.findOne({ email: Email });
    // const user = false;

    if (!user) {
      console.log("otp =>", otp);
      console.log("email =>", Email);
      // send mail with defined transport object
      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };



      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error), "otp errorrrrrrrrrr";
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("user/otp");
      });
    } else {
      req.session.signup_err = true;
      res.redirect("/signup");
    }

    // res.render("user/otp");
  },
  verifyotp: (req, res) => {
    console.log(otp, "otp");
    var userOtp = [];
    console.log(req.body, "otp");
    for (let value of Object.values(req.body)) {
      console.log(value);
      userOtp.push(value);
    }
    var userOtp = userOtp.join("");
    console.log(userOtp, "userOtpp");
    if (otp == userOtp) {
      const newUser = new userModel({
        name: UserName,
        email: Email,
        phone: phoneNumber,
        password: Password,
        // confirm: Confirm,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(() => {
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/login");
            });
        });
      });
    } else {
      res.render("user/otp", { msg: "otp is incorrect", login: false });
    }

    console.log(req.body, "body");
    // res.render("user/userlogin");
  },
  resentOpt: (req, res) => {

    var mailOptions = {
      to: Email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error), "otp errorrrrrrrrrr";
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log(otp);
      res.render("user/otp", { login: false });
    });
  },
  optPage: (req, res) => {
    res.render("user/otp", { login: false });
  },

  // buy page

  buy: (req, res) => {
    res.render("user/buy");
  },

  products: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let userId = req.session.userID
    let logged = req.session.loginStatus;


    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }



    let products = await productModel
      .find({ block: false })
      .skip((page - 1) * product_limit)
      .limit(product_limit);

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });
  },


  about: async (req, res) => {
    let logged = req.session.loginStatus;
    res.render("user/about", { logged });
  },
  contact: (req, res) => {
    let logged = req.session.loginStatus;
    res.render("user/contact", { logged });
  },



  productDetails: async (req, res) => {
    logged = req.session.loginStatus
    const productId = req.params.id;
    const products = await productModel.findOne({ _id: productId });
    res.render("user/product-details", { products, logged });
  },


  searchProduct: async (req, res) => {

    let searchData = req.body.searchData;
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ productName: { $regex: new RegExp("^" + searchData + ".*", "i") } })
      .skip((page - 1) * product_limit)
      .limit(product_limit)


    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });

  },
  forget: (req, res) => {
    res.render("user/forget");
  },

  otpPage: async (req, res) => {
    const Email = req.body.email;

    const user = await userModel.find({ email: Email });
    req.session.email = Email;

    if (user) {
      console.log(otp);
      var mailOptions = {
        to: Email,
        subject: "Otp for registration is: ",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error), "otp errorrrrrrrrrr";
        } else {
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          res.render("user/otpPage");
        }
      });
    } else {
      req.session.user_err = true;
      res.redirect("/forgot");
    }
  },
  verify_otp: (req, res) => {
    userotp = req.body.otp;

    if (userotp == otp) {
      res.render("user/newPassword");
    } else {
      console.log("otp incorrect");
    }
  },
  newPassword: async (req, res) => {
    pass1 = req.body.pass1;
    pass2 = req.body.pass2;
    userEmail = req.session.email;
    console.log(userEmail, "session => mail");
    newPass = await bcrypt.hash(pass2, 10);
    user = await userModel.updateOne(
      { email: userEmail },
      { $set: { password: newPass } }
    );

    res.redirect("/login");
  },


  sortHightoLow: async (req, res) => {


    let page = req.query.page;
    console.log(page)
    let product_limit = 4;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ block: false })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: -1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });


  },

  sortLowtoHigh: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ block: false })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });

  },

  //  filtering

  two_to_five: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ $and: [{ block: false }, { price: { $lte: 2000, $gte: 5000 } }] })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });


  },
  five_to_fifteen: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ $and: [{ block: false }, { price: { $lte: 5000, $gte: 15000 } }] })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });
  },
  fifteen_to_twentyfive: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ $and: [{ block: false }, { price: { $lte: 25000, $gte: 15000 } }] })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });
  },
  twentyfive_to_thirtyfive: async (req, res) => {
    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ $and: [{ block: false }, { price: { $lte: 35000, $gte: 25000 } }] })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });
  },
  thirtyfive_to_above: async (req, res) => {

    let page = req.query.page;
    let product_limit = 8;
    let total_product;
    let logged = req.session.loginStatus;
    let userId = req.session.userID

    let wishlist = await wishlistModel.findOne({ user: userId }).populate('products')
    let wishlistItems;
    if (wishlist != null) {
      wishlistItems = wishlist?.products;
    } else {
      wishlistItems = [];
    }

    let products = await productModel
      .find({ $and: [{ block: false }, { price: { $gte: 35000 } }] })
      .skip((page - 1) * product_limit)
      .limit(product_limit)
      .sort({ price: 1 });

    let pagination =
      (await productModel.find({ block: false }).countDocuments()) /
      product_limit;
    let pagination_count = Math.ceil(pagination);

    res.render("user/product", {
      logged,
      products,
      current_page: page,
      total_product,
      pagination_count,
      wishlistItems
    });


  },
  getWishlist: async (req, res) => {
    userId = req.session.userID
    logged = req.session.loginStatus
    if (userId) {
      let wishlist = await wishlistModel.findOne({ user: ObjectId(userId) })

      if (wishlist) {
        let items = await wishlistModel.findOne({ user: ObjectId(userId) }).populate('products')
        console.log(items);
        res.render('user/wishlist', { logged, items })
      } else {
        console.log("sorry you dont have wishlist");
        res.redirect('/')
      }
    } else {
      console.log("should be logged");
      res.redirect("/")
    }

  },
  addtowishlist: async (req, res) => {
    let userId = req.session.userID
    let product_id = req.params.id

    console.log(product_id);

    if (userId) {
      let wishlist = await wishlistModel.findOne({ user: ObjectId(userId) })

      console.log(wishlist, "< wishlist");

      if (wishlist) {
        await wishlistModel.findOneAndUpdate({ user: ObjectId(userId) }, { $push: { products: product_id } })
        console.log("added");
        res.json({ added: true })
      } else {
        let newWishlist = new wishlistModel({
          user: userId,
          products: [product_id]
        })

        newWishlist.save().then(() => {
          res.json({ added: true })
        })
      }
    } else {
      res.json({ loginerr: true })

    }
  },
  removeFromWishlist: async (req, res) => {
    let userId = req.session.userID
    let prodId = req.params.id

    let item = await wishlistModel.updateOne({ user: userId }, { $pull: { products: prodId } })
    res.json({ remove: true })
  },




  addtocart: async (req, res) => {

    let productId = req.params.id;
    let userId = req.session.userID;
    let Quantity = 1;
    let product_price = parseInt(req.body.price)
    let productName = req.body.productName
    let cart = await cartModel.findOne({ user_id: userId })
    console.log(req.body, "reqqqqqqqqq");




    if (!userId) {
      res.json({ loginerr: true })
    } else {

      let item = await wishlistModel.updateOne({ user: userId }, { $pull: { products: productId } })


      if (cart) {
        console.log("one");
        let itemIndex = cart.items.findIndex(
          (p) => p.products == productId
        );
        if (itemIndex > -1) {
          console.log("two");
          let productItem = cart.items[itemIndex];
          console.log(productItem.quantity, "<<< qua");
          productItem.quantity += Quantity


          productItem.totalPrice = productItem.quantity * productItem.productPrice

          cart.total = cart.items.reduce((acc, current) => {
            return acc + current.totalPrice
          }, 0)
          cart.subtotal = 0;


          await cart.save()

        } else {
          console.log("three");
          await cartModel.updateOne({ user_id: userId }, {
            $push: {
              items: {
                products: productId,
                quantity: Quantity,
                productName: productName,
                productPrice: product_price,
                totalPrice: product_price * Quantity
              }
            }
          })

          await cartModel.updateOne({ user_id: userId }, { $inc: { total: product_price } })
          await cartModel.updateOne({ user_id: userId }, { $set: { subtotal: 0 } })



        }



        res.json({ updated: true })

      } else {
        console.log("four");

        let newCart = new cartModel({
          user_id: userId,
          items: [{
            products: productId,
            quantity: Quantity,
            productName: productName,
            productPrice: product_price,
            totalPrice: product_price * Quantity
          }],
          total: product_price
        })
        await newCart.save().then(() => {
          res.json({ added: true })
          // res.redirect('/productDetails')
        })



      }

    }




  },
  cart: async (req, res) => {
    userId = req.session.userID
    let logged = req.session.loginStatus
    if (userId) {
      let cart = await cartModel.findOne({ user_id: userId }).populate('items.products')
      let coupons = await couponModel.find({})
      if (cart) {
        let products = cart.items
        console.log(products);
        res.render("user/cart", {
          logged,
          products,
          cart,
          coupons
        })
      } else {
        console.log("no cart");
      }

    } else {
      res.redirect("/login")
    }




  },
  deleteFromCart: async (req, res) => {
    let logged = req.session.loginStatus
    if (logged) {
      let productId = req.params.id
      let user = req.session.userID
      let cartarr = await cartModel.find({ user_id: user })
      let cart = cartarr[0]
      let itemIndex = cart.items.findIndex(
        (p) => p.products == productId);
      let product = cart.items[itemIndex]

      productPrice = product.productPrice
      productQuantity = product.quantity
      console.log(productId, "product_id");
      cart.total = cart.total - productPrice * productQuantity
      console.log(cart.total, "total");
      await cartModel.findOneAndUpdate({ user_id: user }, { $pull: { items: { products: productId } } })
      cart.subtotal = 0;
      cart.save().then(() => {
        res.json({ status: true })
      })
    } else {
      res.redirect('/login')
    }
  },
  cartIncrement: async (req, res) => {
    let logged = req.session.loginStatus
    if (logged) {
      let productId = req.params.id;
      let userId = req.session.userID;
      let Quantity = 1;
      let cart = await cartModel.findOne({ user_id: userId })
      let itemIndex = cart.items.findIndex(
        (p) => p.products == productId);
      let product = cart.items[itemIndex]
      let productPrice = product.productPrice
      cart.total = cart.total + productPrice
      product.totalPrice = product.totalPrice + productPrice
      product.quantity += Quantity
      cart.subtotal = 0;
      await cart.save().then(() => {
        res.json({ success: true })
      })
    } else {
      res.redirect('/login')
    }


  },
  cartDecrement: async (req, res) => {
    let logged = req.session.loginStatus
    if (logged) {
      let productId = req.params.id;
      let userId = req.session.userID;
      let Quantity = 1;
      let cart = await cartModel.findOne({ user_id: userId })
      let itemIndex = cart.items.findIndex(
        (p) => p.products == productId);
      let product = cart.items[itemIndex]
      let productPrice = product.productPrice
      cart.total = cart.total - productPrice
      product.totalPrice = product.totalPrice - productPrice
      product.quantity -= Quantity

      cart.subtotal = 0;
      if (product.quantity < 1) {
        await cartModel.findOneAndUpdate({ user_id: userId }, { $pull: { items: { products: productId } } })
        await cartModel.updateOne({ user_id: userId }, { $inc: { total: -productPrice } })
        await cartModel.updateOne({ user_id: userId }, { $set: { subtotal: 0 } })
        res.json({ Deleted: true })
      } else {

        await cart.save().then(() => {
          res.json({ success: true })
        })
      }



    } else {
      res.redirect('/login')
    }

  },
  checkout: async (req, res) => {
    console.log('1');
    let logged = req.session.loginStatus
    if (logged) {
      let userId = req.session.userID
      let user = await userModel.findOne({ _id: userId }, { address: 1 })
      let address = user.address[0]

      let addressType = user.address
      let cart = await cartModel.findOne({ user_id: userId })
      res.render('user/checkout', { logged, address, addressType, cart })


    } else {
      res.redirect('/login')
    }

  },
  newAddress: async (req, res) => {
    let logged = req.session.loginStatus
    let userId = req.session.userID
    if (logged) {
      const { fullName, phoneNumber, address, addressType, city, state, pincode } = req.body
      let user = await userModel.findOne({ _id: userId })
      user.address.unshift({
        fullName,
        phoneNumber,
        address,
        addressType,
        city,
        state,
        pincode
      })
      user.save().then(() => {
        res.redirect('/checkout')
      })
    } else {
      res.redirect("/login")
    }

  },
  changeAddress: async (req, res) => {
    let index = req.body.index
    let logged = req.session.loginStatus
    let userId = req.session.userID
    if (logged) {
      let temp;
      let user = await userModel.findOne({ _id: userId })
      let address = user.address

      temp = address[0];
      address[0] = address[index];
      address[index] = temp

      user.save().then(() => {
        res.json({ success: true })

      })



    } else {
      res.redirect('/login')
    }
  },
  profile: async (req, res) => {
    let logged = req.session.loginStatus
    let userId = req.session.userID
    if (logged) {
      let profile = await userModel.find({ _id: userId })
      let user = profile[0]
      res.render("user/profile", { logged, user })

    } else {
      res.redirect("/login")
    }
  },
  editProfile: async (req, res) => {
    let logged = req.session.loginStatus
    let userId = req.session.userID
    if (logged) {
      let user = await userModel.find({ _id: userId })
      let profile = user[0]
      res.render("user/editProfile", { logged, profile })

    } else {
      res.redirect("/login")
    }
  },
  changeProfile: async (req, res) => {
    let userId = req.session.userID
    let Name = req.body.fullName
    let Phone = req.body.phone
    let Email = req.body.email
    await userModel.findOneAndUpdate({ _id: userId },
      {
        $set:
        {
          name: Name,
          phone: Phone,
          email: Email
        }
      }).then(() => {
        res.redirect('/profile')
      })


  },
  order: async (req, res) => {
  
    let userId = req.session.userID
    let logged = req.session.loginStatus
    let payment = req.body.paymentMethod
  


    let user = await userModel.findOne({ _id: userId })
    let address = user.address[0]
  
    let status = payment === "cod" ? "Placed" : "Pending";
    let paymentStatus = payment === "cod" ? "Unpaid" : "Paid";
    let date = new Date();
    let cart = await cartModel.findOne({ user_id: userId })
    let productName = cart.productName
    let totalProduct = cart.items.length
    let amount = cart.total
    const userOrder = {
      address: {
        name: address.fullName,
        phoneNumber: address.phoneNumber,
        address: address.address,
        city: address.city,
        state: address.state,
        landmark: address.landmark,
        pincode: address.pincode
      },
      userId: userId,
      items: cart.items,
      paymentStatus: paymentStatus,
      orderStatus: status,
      paymentMethod: payment,
      totalProduct: totalProduct,
      totalAmount: amount,
    };
    const orderId = await orderModel.create(userOrder);
    
    if (payment == "Razorpay") {
     

      var options = {
        amount: amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId._id,
      };

      instance.orders.create(options, function (err, order) {
        if (err) {
        console.log(err);  
        } else {
          
         
         
          res.json({order,userOrder,user})
        }
      });

    } else if (payment == 'cod') {
      await cartModel.findOneAndUpdate({ user_id: userId }, { $set: { items: [], total: 0 } })
      res.json({ codSuccess: true })

    }




  },
 


  verifyPayment: async (req,res)=>{
    console.log("inside verify");
    try {
      const userId = req.session.userID;
      await cartModel.findOneAndUpdate({ user_id: userId }, { $set: { items: [], total: 0 } })
     let data=req.body
     console.log(data);
      
      console.log(data['payment[razorpay_order_id]'],'payment.razorpay_order_id');
      
  
      let hmac = crypto
          .createHmac("sha256", "gBBWwEBxMziyqovi7vJz27Bo")
          .update(data['payment[razorpay_order_id]']+'|'+data['payment[razorpay_payment_id]'])
          .digest("hex");
      const orderId = data['orders[receipt]'];
      console.log(hmac,'hmac');
      
      if (hmac == data['payment[razorpay_signature]']) {
          console.log('hiii');
          await orderModel.updateOne(
              { _id: orderId },
              {
                  $set: {
                      orderStatus: "Placed",
                  },
              }
          );
          await userModel.findOneAndUpdate({_id:userId},{$set:{applyCoupon:false}}).then((re)=>{console.log(re,'yssssss');})
          res.json({ status: true });
      } else {
          res.json({ status: false });
      }
  } catch (error) {
      console.log(error.message);
      
  }
  },
  orderSuccessPage: async (req, res) => {
    let logged = req.session.loginStatus
    if (logged) {


      let userId = req.session.userID;
      const cartView = await cartModel.findOne({ userId });
      const userDetails = await userModel.findOne({ userId });
      const products = await productModel.find({})
      const subtotal = cartView.subtotal


      let user = req.session.userLogin;
      if (cartView) {
        var cartLength = cartView.items.length;
      } else {
        var cartLength = 0;
      }
      let lastOrder = await orderModel.find({ userId: userId })
      let length = lastOrder.length;
      console.log(length);
      length = length - 1;
      lastOrder = await orderModel.findOne({ userId: userId }).skip(length).populate('items.products')

      console.log(lastOrder, "-------------------last order");
      res.render("user/oderSuccessPage", {
        user,
        name: userDetails.name,
        products,
        userDetails,
        cartLength,
        lastOrder,
        logged,
        subtotal

      });

    } else {
      res.redirect('/login')
    }
  },
  viewOrders: async (req, res) => {
    let logged = req.session.loginStatus
    let userId = req.session.userID
    let orders = await orderModel.find({ userId: userId })
    let arr = orders[0]


    // console.log(arr.productName)
    console.log(arr)






    res.render('user/viewOrders', { arr, orders, logged })

  },
  singleOrder: async (req, res) => {
    let logged = req.session.loginStatus
    let orderId = req.params.id
    let orderdata = await orderModel.find({ _id: orderId }).populate('items')
    let order = orderdata[0]
    let items = order.items
    console.log(items, "order details")
    res.render('user/singleOrder', { logged, order, items })

  },
  applyCoupon: async (req, res) => {

    let userId = req.session.userID
    let cartdata = await cartModel.find({ user_id: userId })
    let cart = cartdata[0]
    let item = cart.items
    if (userId) {
      let couponName = req.body.coupon
      let coupon = await couponModel.findOne({ couponName: couponName })
      if (coupon && cart.total >= coupon.minimumAmount) {
        let disc = (cart.total * coupon.discount) / 100
        disc > coupon.maximumDiscount ? disc = coupon.maximumDiscount : disc = disc
        let subtotal = cart.total - disc
        await cartModel.findOneAndUpdate({ user_id: userId }, { $set: { subtotal: subtotal } })
        let car = await cartModel.find({ user_id: userId })
        console.log(car);
        res.json({ applicable: true })



      } else {
        res.json({ error: true })
        console.log("false")
      }


    } else {
      res.redirect('/login')

    }
  },
  orderCancel: async (req, res) => {
    console.log(req.body, "order ID body")
    let orderId = req.body.orderId
    await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: "Cancelled" } })
    console.log("<>", order, "order")
    res.json({cancel:true})



  }
}