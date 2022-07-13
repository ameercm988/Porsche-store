const usersHelper = require('../helpers/usersHelper');
// const adminHelper = require('../helpers/adminHelper');


module.exports = {
    getHome: (req, res, next) => {
        try {
            res.render('users/users-index')
        } catch {

        }
    },
    getLogin: (req, res) => {
        res.render('users/users-login')
    },
    postLogin: (req, res, next) => {
        try {
            usersHelper.doLogin(req.body)
            res.redirect('/')
        } catch {

        }
    },
    getSignup: (req, res, next) => {
        res.render('users/users-signup')
    },
    postSignup: (req, res, next) => {
        try {
            usersHelper.doSignup(req.body)
            res.redirect('/login')
        } catch {

        }
    },
    getLogout: (req, res, next) => {
        res.redirect('/login')
    }



}