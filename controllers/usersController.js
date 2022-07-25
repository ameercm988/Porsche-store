const usersHelper = require('../helpers/usersHelper');
const twilio = require('twilio')
const twilioHelpers = require('../helpers/twilioHelper')
const middleWare = require('../helpers/middleware/verifySignup');
const productHelper = require('../helpers/productHelper');
const categoryHelper = require('../helpers/categoryHelper');


module.exports = {
    getHome: (req, res, next) => {
        productHelper.getAllProducts().then((products) => {
            categoryHelper.getAllCategory().then((category) => {
                if (req.session.isLoggedIn) {
                    let user = req.session.user
                    res.render('users/users-index', { user, layout: 'users-layout', products, category, Home: true })
                } else {
                    res.render('users/users-index', { home: true, layout: 'users-layout', products, category, Home: true })
                }
            })
        })
    },

    getLogin: (req, res) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-login', { login: true, layout: 'users-layout', userError: req.session.userError, loginError: req.session.loginError, dataBaseError: req.session.dataBaseError, blockError: req.session.blockError })
            req.session.userError = false
            req.session.loginError = false
            req.session.dataBaseError = false
        }
    },

    postLogin: (req, res, next) => {
        usersHelper.doLogin(req.body).then((data) => {
            if (data.isUserValid) {
                if (data.blockStatus) {
                    req.session.isLoggedIn = false
                    req.session.blockError = data.err
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
                req.session.dataBaseError = "Error with database"
                res.redirect('/login')
            } else {
                req.session.userError = data.err
                res.redirect('/login')
            }
        })
    },

    getSignup: (req, res, next) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-signup', { layout: 'users-layout', emailError: req.session.emailError, signup: true, twillioError: req.session.twilioError })
            req.session.emailError = false
            req.session.twilioError = false
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
                }).catch(() => {
                    req.session.twilioError = "twilio server id down"
                    res.redirect('/signup')
                })
            }
        })
    },

    getOtp: (req, res, next) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/otp', { layout: 'users-layout', otpError: req.session.otpError })
            req.session.otpError = false
        }
    },

    postOtp: (req, res, next) => {

        // try {
        //     let response = twilioHelpers.otpVerify(req.body, req.session.body)
        //     if (response.valid) {
        //     let data = usersHelper.doSignup(req.session.body)
        //     }
        // } catch (error) {
        // }

        twilioHelpers.
            otpVerify(req.body, req.session.body).then((response) => {
                usersHelper.doSignup(req.session.body).then((data) => {
                    if (data.isUserValid) {
                        req.session.isLoggedIn = true
                        req.session.user = data.user
                        res.redirect('/')
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

    getLogout: (req, res) => {
        req.session.isLoggedIn = null
        req.session.user = false
        res.redirect('/')
    }
}