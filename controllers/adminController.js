// const express = require('express')
const adminHelper = require('../helpers/adminHelper')
const productHelper = require('../helpers/productHelper')


module.exports = {

    getLogin: (req, res) => {
        if (req.session.isAdminLoggedIn) {
            res.redirect('/admin/')
        } else {
            res.render('admin/admin-login', { layout: 'admin-layout', adminError: req.session.adminError, login: true })
            req.session.adminError = false
        }

    },

    postLogin: (req, res, next) => {
        adminHelper.doLogin(req.body).then((data) => {
            if (data.isAdminValid) {
                req.session.isAdminLoggedIn = true
                req.session.admin = data.admin
                res.redirect('/admin/')

            } else {
                req.session.adminError = data.err
                res.redirect('/admin/login')

            }
        }).catch((err) => {
            res.redirect('/admin/login')

            console.log(err);
        })
    },

    getHome: (req, res, next) => {
        res.render('admin/admin-index', { layout: 'admin-layout' })
    },



    getViewProducts : (req, res, next) => {
        productHelper.getAllProducts().then((products) => {
            res.render('admin/view-products', {layout : 'admin-layout', products })
        })
        
    },

    getAddProducts: (req, res, next) => {
        res.render('admin/add-products', { layout: 'admin-layout' })
    },

    postAddProducts : (req, res, next) => {
        console.log(req.body);
        productHelper.addProduct(req.body).then((id) => {
            console.log(id+'data returned');
            console.log(req.files);
            
            let img1 = req.files.image1
            let img2 = req.files.image2
            let img3 = req.files.image3
            let img4 = req.files.image4

            img1.mv('./public/productimages/' +id+ '_1.jpg')
            img2.mv('./public/productimages/' +id+ '_2.jpg')
            img3.mv('./public/productimages/' +id+ '_3.jpg')
            img4.mv('./public/productimages/' +id+ '_4.jpg')

            res.redirect('/admin/add-products')

        }).catch((err) => {
            console.log(err+"file not recieved");
         })
    },



    getLogout: (req, res) => {
        req.session.isAdminLoggedIn = null
        req.session.admin = null
        res.redirect('/admin/login')
    }
}