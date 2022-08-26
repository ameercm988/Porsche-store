const usersHelper = require('../helpers/usersHelper');
const twilio = require('twilio')
const twilioHelpers = require('../helpers/twilioHelper')
const middleWare = require('../helpers/middleware/verifySignup');
const productHelper = require('../helpers/productHelper');
const categoryHelper = require('../helpers/categoryHelper');
const { use } = require('../routes/users');
const { response } = require('../app');
const { Db } = require('mongodb');
const adminHelper = require('../helpers/adminHelper');
require('dotenv').config()



const PORT = process.env.PORT

if (!PORT) {
  throw new Error("PORT variable not verified")
}


module.exports = {
    getHome: (req, res, next) => {

        productHelper.getAllProducts().then((products) => {
            categoryHelper.getAllCategory().then(async (category) => {
                let couponData = await adminHelper.getCoupons()
                if (req.session.isLoggedIn) {
                    let user = req.session.user
                    let userId = user._id
                    let cartCount = await usersHelper.getCartCount(userId)
                    let totalAmount = await usersHelper.getTotalAmount(userId)
                    let wishlistCount = await usersHelper.getWishlistCount(userId)
                    usersHelper.getCartDetails(userId).then((cartItems) => {
                        res.render('users/users-index', { user, layout: 'users-layout', products, category, cartItems, cartCount, totalAmount, wishlistCount, couponData, Home: true })
                    })
                } else {
                    res.render('users/users-index', { guest: true, layout: 'users-layout', products, category, couponData, Home: true })
                }
            })
        })
    },

    getLogin: (req, res) => {

        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-login', { login: true, layout: 'users-layout', loginError: req.session.loginError})
            // req.session.userError = false
            req.session.loginError = false
            // req.session.dataBaseError = false
            // req.session.blockError = false 
        }
    },

    postLogin: (req, res, next) => {

        usersHelper.doLogin(req.body).then((data) => {
            if (data.isUserValid) {
                if (data.blockStatus) {
                    req.session.isLoggedIn = false
                    req.session.loginError = data.err
                    res.redirect('/login')
                } else {

                    req.session.isLoggedIn = true
                    req.session.user = data.user
                    res.redirect('/')
                }
            } else {
                req.session.isLoggedIn = false
                req.session.loginError = data.err
                res.redirect('/login')
            }
        }).catch((data) => {
            if (data.isUserValid = false) {
                req.session.loginError = "Error with database"
                res.redirect('/login')
            } else {
                req.session.loginError = data.err
                res.redirect('/login')
            }
        })
    },

    getSignup: (req, res, next) => {

        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-signup', { layout: 'users-layout', emailError: req.session.emailError, signup: true})
            req.session.emailError = false
            // req.session.twilioError = false
        }
    },

    postSignup: (req, res, next) => {

        req.session.body = req.body
        middleWare.verifySignup(req.body).then((err) => {
            if (err) {
                req.session.emailError = err
                res.redirect('/signup');
            } else {
                twilioHelpers.dosms(req.session.body).then(() => {

                    res.redirect('/otp')
                }).catch((err) => {
                    req.session.emailError = "twilio server is down"
                    res.redirect('/signup')
                })
            }
        })
    },

    getOtp: (req, res, next) => {

        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            number = req.session.body.mobilenumber.slice(6)
            res.render('users/otp', { layout: 'users-layout', otpError: req.session.otpError, number })
            req.session.otpError = false
        }
    },

    postOtp: (req, res, next) => {

        twilioHelpers.otpVerify(req.body, req.session.body).then((response) => {
            usersHelper.doSignup(req.session.body).then((data) => {
                if (data.isUserValid) {
                    req.session.isLoggedIn = false
                    req.session.user = data.user
                    req.session.userId = data.user._id
                    res.redirect('/login')
                } else {
                    res.redirect('/signup')
                }
            }).catch((err) => {
                req.session.err = err
                res.redirect('/signup')
            })
        }).catch((err) => {
            if (err) {
                req.session.otpError = err
                res.redirect('/otp')
            }
        })
    },

    // product section >>>>>>>>>>>>>>>>>>>>>>>>>>

    getShop: (req, res, next) => {

        productHelper.getAllProducts().then((products) => {
            categoryHelper.getAllCategory().then(async (category) => {
                if (req.session.isLoggedIn) {
                    let user = req.session.user
                    let userId = user._id
                    let cartCount = await usersHelper.getCartCount(userId)
                    let wishlistCount = await usersHelper.getWishlistCount(userId)
                    usersHelper.getCartDetails(userId).then((cartItems) => {
                        res.render('users/shop', { user, layout: 'users-layout', products, category, cartCount, cartItems, wishlistCount, Home: true })
                    })

                } else {
                    res.render('users/shop', { guest: true, layout: 'users-layout', products, category, Home: true })
                }
            })
        })
    },

    getShopMen: async (req, res, next) => {

        try {
            let menProducts = await productHelper.getAllMenProducts()
            if (req.session.isLoggedIn) {
                let user = req.session.user
                let userId = user._id
                let cartCount = await usersHelper.getCartCount(userId)
                let wishlistCount = await usersHelper.getWishlistCount(userId)
                let cartItems = await usersHelper.getCartDetails(userId)
                res.render('users/shop-men', { layout: 'users-layout', user, menProducts, cartCount, cartItems, wishlistCount })
            } else {
                res.render('users/shop-men', { layout: 'users-layout', menProducts })
            }

        } catch (error) {
            res.redirect('/error-page')
        }

    },

    getShopWomen: async (req, res, next) => {

        try {
            let womenProducts = await productHelper.getAllWomenProducts()
            if (req.session.isLoggedIn) {
                let user = req.session.user
                let userId = user._id
                let cartCount = await usersHelper.getCartCount(userId)
                let wishlistCount = await usersHelper.getWishlistCount(userId)
                let cartItems = await usersHelper.getCartDetails(userId)
                res.render('users/shop-women', { layout: 'users-layout', user, womenProducts, cartCount, cartItems, wishlistCount })
            } else {
                res.render('users/shop-women', { layout: 'users-layout', womenProducts })
            }

        } catch (error) {
            res.redirect('/error-page')
        }

    },


    getProductDetail: (req, res, next) => {

        proId = req.params.id
        productHelper.getViewProduct(proId).then((product) => {
            productHelper.getAllProducts().then(async (allProducts) => {
                if (req.session.isLoggedIn) {
                    let user = req.session.user
                    let userId = user._id
                    let cartCount = await usersHelper.getCartCount(userId)
                    let wishlistCount = await usersHelper.getWishlistCount(userId)
                    usersHelper.getCartDetails(userId).then((cartItems) => {
                        res.render('users/product-detail', { user, layout: 'users-layout', product, cartCount, allProducts, wishlistCount, cartItems })
                    })
                } else {
                    res.render('users/product-detail', { guest: true, layout: 'users-layout', product, allProducts })
                }
            })
        }).catch((error) => {
            res.redirect('/error-page')
        })
    },

    //cart section >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    getCart: async (req, res, next) => {

        // Trying out trycatch

        try {
            let user = req.session.user

            let userId = user._id

            let cartItems = await usersHelper.getCartDetails(userId)
            let cartCount = await usersHelper.getCartCount(userId)
            let wishlistCount = await usersHelper.getWishlistCount(userId)
            let totalAmount = await usersHelper.getTotalAmount(userId)
            let couponData = await adminHelper.getCoupons()
            couponCode = couponData[0].Name

            res.render('users/shopping-cart', { layout: 'users-layout', user, cartCount, cartItems, totalAmount, wishlistCount, couponCode })

        } catch (error) {

            res.redirect('/error-page')                       // handling catch error
        }
    },

    getAddCart: (req, res, next) => {

        let proId = req.params.id
        let userId = req.session.user._id
        usersHelper.addToCart(proId, userId).then((response) => {
            res.json({ status: true })
        })
    },

    postChangeQuantity: (req, res, next) => {

        usersHelper.changeQuantity(req.body).then(async (response) => {
            response.totalAmount = await usersHelper.getTotalAmount(req.body.user)
            res.json(response)
        })
    },

    postRemoveItem: (req, res, next) => {

        usersHelper.removeCartItem(req.body).then((response) => {
            res.json(response)
        })
    },

    getCheckout: async (req, res, next) => {

        let user = req.session.user
        let userId = user._id
        let cartItems = await usersHelper.getCartDetails(userId)
        let totalAmount = await usersHelper.getTotalAmount(userId)
        let cartCount = await usersHelper.getCartCount(userId)
        let wishlistCount = await usersHelper.getWishlistCount(userId)
        let savedAddress = await usersHelper.getSavedAddress(userId)

        res.render('users/checkout', { layout: 'users-layout', user, cartCount, totalAmount, savedAddress, wishlistCount, cartItems })
    },

    postCheckout: async (req, res, next) => {

        try {
            if (req.body.saveAddress == 'on') {
                await usersHelper.addNewAddress(req.body, req.session.user._id)
            }
    
            let products = await usersHelper.gerCartProList(req.body.userId)
            let totalAmount = await usersHelper.getTotalAmount(req.body.userId)
            let discountData = null
    
            if (req.body.Coupon_Code) {
                await usersHelper.checkCoupon(req.body.Coupon_Code, totalAmount).then((response) => {
                    discountData = response
                }).catch(() => discountData = null)
    
            }
    
            usersHelper.placeOrder(req.body, products, totalAmount, discountData).then((orderId) => {
    
                if (req.body.Pay_Method === 'COD') {
                    res.json({ codSuccess: true })
                } else {
                    let netAmount = (discountData) ? discountData.amount : totalAmount
                    usersHelper.generateRazorpay(orderId, netAmount).then((response) => {
                        res.json(response)
                    })
                }
    
            })
        } catch (error) {
            res.redirect('/error-page') 
        }

        
    },

    getOrderSucces: (req, res, next) => {

        let user = req.session.user

        res.render('users/order-success', { layout: 'users-layout', user })
    },

    getOrders: async (req, res, next) => {

        try {
            let user = req.session.user
            let userId = user._id
            let orders = await usersHelper.getViewOrders(userId)
            let cartCount = await usersHelper.getCartCount(userId)
            let wishlistCount = await usersHelper.getWishlistCount(userId)
            let cartItems = await usersHelper.getCartDetails(userId)
    
            res.render('users/view-orders', { layout: 'users-layout', user, orders, cartCount, cartItems, wishlistCount }) 
        } catch (error) {
            res.redirect('/error-page')
        }
        

    },

    getOrderProducts: async (req, res, next) => {

        let user = req.session.user
        let userId = user._id
        try {
        
        let cartCount = await usersHelper.getCartCount(userId)
        let cartItems = await usersHelper.getCartDetails(userId)
        let wishlistCount = await usersHelper.getWishlistCount(userId)
        let products = await usersHelper.orderProducts(req.query.id)
        let name = products[0].name
        let total = products[0].amount
        let discount = products[0].discount.discount
        let netAmount = products[0].discount.amount
        let invoice =  products[0].invoice

        res.render('users/order-products', { layout: 'users-layout', user, products, cartCount, cartItems, wishlistCount, total, name, discount, netAmount, invoice })
        
        } catch (err) {
            res.redirect('/error-page')
        }
        
    },

    getCancelOrder: (req, res, next) => {

        usersHelper.cancelOrder(req.query.id).then((response) => {
            res.redirect('/orders')
        })
    },

    postCouponCheck: async (req, res, next) => {

        let userId = req.session.user._id
        let couponCode = req.body.coupon
        let totalAmount = await usersHelper.getTotalAmount(userId)
        usersHelper.checkCoupon(couponCode, totalAmount).then((response) => {
            res.json(response)
        }).catch((response) => {
            res.json(response)
        })
    },

    postVerifyPayment: (req, res, next) => {

        usersHelper.verifyPayment(req.body).then(() => {
            usersHelper.changePaymentStatus(req.body['order[receipt]']).then(() => {
                res.json({ status: true })
            })
        }).catch((err) => {
            res.json({ status: false, errMsg: "Payment failed" })
        })
    },

    getProfile: async (req, res, next) => {

        let user = req.session.user
        let userId = user._id

        try {
            let cartCount = await usersHelper.getCartCount(userId)
            let cartItems = await usersHelper.getCartDetails(userId)
            let wishlistCount = await usersHelper.getWishlistCount(userId)
            let orders = await usersHelper.getViewOrders(userId)
            let orderCount = await usersHelper.getOrderCount(userId)

            res.render('users/profile', { layout: 'users-layout', user, cartCount, cartItems, orders, orderCount, wishlistCount })
        } catch (error) {
            res.redirect('/error-page')
        }
    },

    getWishlist: async (req, res, next) => {

        let user = req.session.user
        let userId = user._id
        let wishlistItems = await usersHelper.getwishlistItems(userId)
        let wishlistCount = await usersHelper.getWishlistCount(userId)
        let cartItems = await usersHelper.getCartDetails(userId)
        let cartCount = await usersHelper.getCartCount(userId)
        let totalAmount = await usersHelper.getTotalAmount(userId)
        res.render('users/wishlist', { layout: 'users-layout', user, wishlistItems, wishlistCount, cartItems, cartCount, totalAmount })
    },

    getAddToWishlist: (req, res, next) => {

        let userId = req.session.user._id
        let proId = req.params.id
        usersHelper.addToWishlist(userId, proId).then((response) => {
            res.json({ status: true })
        })
    },

    postRemoveWishlist: (req, res, next) => {

        usersHelper.removeWishlist(req.body).then((response) => {
            res.json(response)
        })
    },

    getUserAddress: async (req, res, next) => {

        let user = req.session.user
        let userId = user._id
        let cartItems = await usersHelper.getCartDetails(userId)
        let cartCount = await usersHelper.getCartCount(userId)
        let wishlistCount = await usersHelper.getWishlistCount(userId)
        let savedAddress = await usersHelper.getSavedAddress(userId)
        res.render('users/addressData', { layout: 'users-layout', user, cartCount, wishlistCount, savedAddress, cartItems })
    },

    getAddEditAddress: async (req, res, next) => {
        try {
            let user = req.session.user
            let userId = req.session.user._id
            let cartCount = await usersHelper.getCartCount(userId)
            let wishlistCount = await usersHelper.getWishlistCount(userId)
            let cartItems = await usersHelper.getCartDetails(userId)
            console.log('cartItems.............',cartItems);
            if (req.query.id) {
                let addressId = req.query.id
                let addressData = await usersHelper.getSameAddress(addressId)
                addressData = addressData.address[0]
                res.render('users/addEditAddress', { layout: 'users-layout', user, addressData, cartCount, wishlistCount, cartItems })
            } else {
                res.render('users/addEditAddress', { layout: 'users-layout', user, cartCount, wishlistCount, cartItems })
            } 
        } catch (error) {
            res.redirect('/error-page')
        }
        

    },

    postAddEditAddress: (req, res, next) => {

        if (req.body.addressId) {
            usersHelper.editAddress(req.body, req.body.addressId).then(() => {
                res.redirect('/profileAddress')
            })
        } else {
            usersHelper.addNewAddress(req.body, req.session.user._id).then(() => {
                res.redirect('/profileAddress')
            })
        }
    },

    getRemoveAddress: (req, res, next) => {

            addressId = req.params.id
        usersHelper.removeAddress(addressId, req.session.user._id).then(() => {
            res.redirect('/profileAddress')
        })
       
    },

    getErrorPage : (req, res, next) => {
        res.render('users/errorPage') 
    },

    getLogout: (req, res) => {
        req.session.isLoggedIn = null
        req.session.user = false
        res.redirect('/')
    },

    getPort : (req, res) => {
        res.send(`server on PORT ${PORT}`)
    }
}