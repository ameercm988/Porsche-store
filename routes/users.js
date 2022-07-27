const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')


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


router.get('/cart', verifyLogin, usersController.getCart)


router.get('/product-detail/:id', usersController.getProductDetail)


// router.get('/modal-detail/:id', usersController.getModalDetail)

router.get('/addto-cart/:id', verifyLogin, usersController.getAddCart)


router.get('/logout', usersController.getLogout)


module.exports = router;
