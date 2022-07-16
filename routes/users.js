const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')


router.get('/', usersController.getHome)


router.get('/login',usersController.getLogin)


router.post('/login', usersController.postLogin)


router.get('/signup', usersController.getSignup)


router.post('/signup', usersController.postSignup)


router.get('/otp', usersController.getOtp)


router.post('/otp', usersController.postOtp)


router.get('/logout', usersController.getLogout)


module.exports = router;
