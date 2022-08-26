const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { route } = require('./admin');
require('dotenv').config()


const PORT = process.env.PORT

if (!PORT) {
  throw new Error("PORT variable not verified")
}



const verifyLogin = ((req,res,next) => {
    if (req.session.isLoggedIn) {
        next()
    }else{
        res.redirect('/login')
    }
})


router.get('/', usersController.getHome)


router.get('/login',usersController.getLogin)


router.post('/login', usersController.postLogin)


router.get('/signup', usersController.getSignup)


router.post('/signup', usersController.postSignup)


router.get('/otp', usersController.getOtp)


router.post('/otp', usersController.postOtp)


router.get('/shop', usersController.getShop)


router.get('/shop-MEN', usersController.getShopMen)


router.get('/shop-WOMEN', usersController.getShopWomen)


// router.get('/modal-detail/:id', usersController.getModalDetail)


router.get('/product-detail/:id', usersController.getProductDetail)


router.get('/cart', verifyLogin, usersController.getCart)


router.get('/addto-cart/:id', usersController.getAddCart)


router.post('/change-product-quantity',usersController.postChangeQuantity)


router.post('/remove-cart-item', usersController.postRemoveItem)


router.get('/checkout', verifyLogin, usersController.getCheckout)


router.post('/checkout', usersController.postCheckout)


router.get('/order-success', verifyLogin, usersController.getOrderSucces)


router.get('/orders', verifyLogin, usersController.getOrders)


router.get('/order-products', verifyLogin, usersController.getOrderProducts)


router.get('/cancel-order', verifyLogin, usersController.getCancelOrder)


router.post('/check-coupon', verifyLogin, usersController.postCouponCheck)


router.post('/verify-payment', usersController.postVerifyPayment)


router.get('/profile', verifyLogin, usersController.getProfile)


router.get('/wishlist', verifyLogin, usersController.getWishlist)


router.get('/addto-wishlist/:id', usersController.getAddToWishlist)


router.post('/remove-wishlist-item', usersController.postRemoveWishlist)


router.get('/profileAddress', verifyLogin, usersController.getUserAddress)


router.get('/add-edit-address', verifyLogin, usersController.getAddEditAddress)


router.post('/add-edit-address', usersController.postAddEditAddress)


router.get('/remove-address/:id', verifyLogin, usersController.getRemoveAddress)


router.get('/error-page', usersController.getErrorPage)


router.get('/logout', usersController.getLogout)


router.get('/port', usersController.getPort)


module.exports = router;
