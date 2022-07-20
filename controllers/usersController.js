const usersHelper = require('../helpers/usersHelper');
const twilio = require('twilio')
const twilioHelpers = require('../helpers/twilioHelper')
const middleWare = require('../helpers/middleware/verifySignup')
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
            res.render('users/users-login', { login: true, userError: req.session.userError, loginError: req.session.loginError, dataBaseError: req.session.dataBaseError })
            req.session.userError = false
            req.session.loginError = false
            req.session.dataBaseError = false

        }
    },

    // postLogin: (req, res, next) => {
    //     usersHelper.doLogin(req.body).then((data) => {
    //         console.log('verum data');
    //         console.log(data);
    //         if (data.isUserValid) {
    //             if(data.user){
    //                 req.session.isLoggedIn = true
    //                 req.session.user = data.user
    //                 res.redirect('/')
    //                 // console.log('logged in');
    //             }else{
    //                 req.session.isLoggedIn = false
    //                 req.session.loginError = data.err
    //                 res.redirect('/login')
    //             }
    //         } else {

    //             console.log('no user');
    //             console.log(data.err);
    //             req.session.userError = data.err
    //             res.redirect('/login')
    //             // console.log('not logged in');
    //             // console.log(userInfo);
    //         }
    //     }).catch((err) => {
    //         req.session.dataBaseError = err
    //         res.redirect('/login')
    //     })
    // },

    postLogin: (req, res, next) => {
        usersHelper.doLogin(req.body).then((data) => {
            // console.log('simple data');
            // console.log(data);
            if (data.isUserValid) {

                req.session.isLoggedIn = true
                req.session.user = data.user
                res.redirect('/')
                // console.log('logged in');

            } else {
                req.session.isLoggedIn = false
                req.session.loginError = data.err
                res.redirect('/login')

            }
        }).catch((data) => {
            if (data.isUserValid = false) {
                // console.log('no user');
                // console.log(data);
                req.session.dataBaseError = "Error with database"
                res.redirect('/login')
                // console.log('not logged in');
                // console.log(userInfo);
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
            res.render('users/users-signup', { emailError: req.session.emailError, signup: true, twillioError: req.session.twilioError })
            req.session.emailError = false
            req.session.twilioError = false
        }
    },

    postSignup: (req, res, next) => {
        // console.log('postsignup');
        req.session.body = req.body

        middleWare.verifySignup(req.body).then((err) => {
            if (err) {
                req.session.emailError = err
                // console.log('sessionerr');
                // console.log(req.session.emailError);
                res.redirect('/signup');

            } else {
                twilioHelpers.dosms(req.session.body).then(() => {

                    res.redirect('/otp')
                    // console.log('otp cool');
                    // if (data) {
                    //     // console.log('redirect otp');
                    //     res.redirect('/otp')
                    // } else {
                    //     // console.log('redirect signup');
                    //     res.redirect('/signup');
                    // }
                })
                    .catch(() => {
                        // console.log('otp moonji');
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
            res.render('users/otp', { otpError: req.session.otpError })
            req.session.otpError = false
            // console.log('getotp');
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

            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                    req.session.otpError = err
                    // req.session.err = err
                    // console.log('not in and catch err'+err);
                    res.redirect('/otp')
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