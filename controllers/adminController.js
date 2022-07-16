const e = require('express')
const adminHelper = require('../helpers/adminHelper')


module.exports = {

    getLogin: (req, res) => {
        if (req.session.isAdminLoggedIn) {
            res.redirect('/admin/')
        } else {
            res.render('admin/admin-login', { layout: 'admin-layout' })
        }

    },

    postLogin: (req, res, next) => {
        adminHelper.doLogin(req.body).then((data) => {
            if (data.isAdminValid) {
                req.session.isAdminLoggedIn = true
                req.session.admin = data.admin
                res.redirect('/admin/')

            } else {
                res.redirect('/admin/login')

            }
        }).catch((err) => {
            res.redirect('/admin/login')

            console.log(err);
        })
    },

    getHome: (req,res,next) => {
        if(req.session.isAdminLoggedIn){
            res.render('admin/admin-index', { layout: 'admin-layout' })
        }else{
            res.redirect('/admin/login')
        }
        
    },

    getLogout: (req, res) => {
        req.session.isAdminLoggedIn = null
        req.session.admin = null
        res.redirect('/admin/login')
    }
}