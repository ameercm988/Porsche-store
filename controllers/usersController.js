const usersHelper = require('../helpers/usersHelper');
const twilio = require('twilio')
const twilioHelpers = require('../helpers/twilioHelper')
// const adminHelper = require('../helpers/adminHelper');


module.exports = {
    getHome: (req, res, next) => {
        if (req.session.isLoggedIn) {
            let user = req.session.user
            // console.log(user);
            res.render('users/users-index', { user })
            // console.log('user is there');
        } else {
            res.render('users/users-index', { home: true })
            // console.log('no user');
        }
    },

    getLogin: (req, res) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-login', { login: true })
        }
    },

    postLogin: (req, res, next) => {
        usersHelper.doLogin(req.body).then((data) => {
            if (data.isUserValid) {
                req.session.isLoggedIn = true
                req.session.user = data.user
                res.redirect('/')
                // console.log('logged in');
            } else {
                res.redirect('/login')
                // console.log('not logged in');
                // console.log(userInfo);
            }
        }).catch((err) => {
            res.redirect('/login')
        })
    },

    getSignup: (req, res, next) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/users-signup', { signup: true })
        }       
    },

    postSignup: (req, res, next) => {
        // console.log('postsignup');
        req.session.body = req.body
        twilioHelpers.dosms(req.session.body).then((data) => {
            if (data) {
                // console.log('redirect otp');
                res.redirect('/otp')
            } else {
                // console.log('redirect signup');
                res.redirect('/signup');
            }
        })      
    },

    getOtp : (req,res,next) => {
        if (req.session.isLoggedIn) {
            res.redirect('/')
        } else {
            res.render('users/otp')
        // console.log('getotp');
        }       
    },

    postOtp : (req,res,next) => {
        // console.log('postotp');
        // console.log(req.body);
        // console.log("req.session.body");
        // console.log(req.session.body);
            twilioHelpers.otpVerify(req.body, req.session.body).then((response) => {
                if (response.valid) {
                    usersHelper.doSignup(req.session.body).then((data) => {
                        if (data.isUserValid) {
                            req.session.isLoggedIn = true
                            req.session.user = data.user
                            res.redirect('/')
                            // console.log('signed in');
                        } else {
                            res.redirect('/signup')
                            // console.log('not signed in');
                            // console.log(userInfo);
                        }
                    }).catch((err) => {
                        req.session.err = err
                        // console.log('not in and catch err'+err);
                        res.redirect('/signup')
                    })
                }
            })        
    },

    getLogout: (req, res) => {
        req.session.isLoggedIn = null
        req.session.user = false
        // req.session.destroy()
        res.redirect('/')
    }
}