const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { route } = require('./admin');


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


router.get('/shop-men', usersController.getShopMen)


router.get('/shop-women', usersController.getShopWomen)


router.get('/cart', verifyLogin, usersController.getCart)


router.get('/product-detail/:id', usersController.getProductDetail)


// router.get('/modal-detail/:id', usersController.getModalDetail)


router.get('/addto-cart/:id', usersController.getAddCart)


router.post('/change-product-quantity',usersController.postChangeQuantity)


router.post('/remove-cart-item', usersController.postRemoveItem)


router.get('/checkout', verifyLogin, usersController.getCheckout)


router.post('/checkout', usersController.postCheckout)


router.get('/order-success', verifyLogin, usersController.getOrderSucces)


router.get('/orders', verifyLogin, usersController.getOrders)


router.get('/order-products', verifyLogin, usersController.getOrderProducts)


router.get('/cancel-order', verifyLogin, usersController.getCancelOrder)


router.post('/verify-payment', usersController.postVerifyPayment)


router.get('/profile', verifyLogin, usersController.getProfile)


// router.get('/user-address', verifyLogin, usersController.getUserAddress)


router.get('/logout', usersController.getLogout)


module.exports = router;
