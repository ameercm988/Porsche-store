// const express = require('express')
const adminHelper = require('../helpers/adminHelper')
const productHelper = require('../helpers/productHelper')
const usersHelper = require('../helpers/usersHelper')


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



    getViewProducts: (req, res, next) => {
        productHelper.getAllProducts().then((products) => {
            res.render('admin/view-products', { layout: 'admin-layout', products })
        })

    },

    getAddProducts: (req, res, next) => {
        res.render('admin/add-products', { layout: 'admin-layout' })
    },

    postAddProducts: (req, res, next) => {

        productHelper.addProduct(req.body).then((id) => {


            if (req.files) {
                const file = req.files.images;
                for (let i = 0; i < file.length; i++) {
                    file[i].mv('./public/productImages/' + id + i + ".jpg",)
                }
            }


            // let img1 = req.files.image1
            // let img2 = req.files.image2
            // let img3 = req.files.image3
            // let img4 = req.files.image4

            // img1.mv('./public/productImages/' +id+ '_1.jpg')
            // img2.mv('./public/productImages/' +id+ '_2.jpg')
            // img3.mv('./public/productImages/' +id+ '_3.jpg')
            // img4.mv('./public/productImages/' +id+ '_4.jpg')

            res.redirect('/admin/view-products')

        }).catch((err) => {
            console.log(err + "file not recieved");
        })
    },

    getEditProducts: (req, res, next) => {
        let proId = req.params.id
        productHelper.editProducts(proId).then((products) => {
            res.render('admin/edit-products', { layout: 'admin-layout', products })
        })

    },


    postEditProducts: (req, res, next) => {
        console.log(req.body + "  reqbody");

        let proId = req.params.id
        console.log(proId + "  proId");
        productHelper.updateProducts(proId, req.body).then((products) => {
            
            if (req.files.images) {
                const file = req.files.images;
                for (let i = 0; i < file.length; i++) {
                    file[i].mv('./public/productImages/' + id + i + ".jpg",)
                }
            }
            res.redirect('/admin/view-products')
        })
    },

    getDeleteProducts: (req, res, next) => {
        proId = req.query.id
        productHelper.deleteProduct(proId).then((response) => {
            res.redirect('/admin/view-products')
        })
    },

    getViewUsers: (req, res, next) => {
        adminHelper.viewUsers().then((users) => {
            res.render('admin/view-users', { layout: 'admin-layout', users })
        })

    },

    getBlockUser: (req, res, next) => {
        // console.log(req.params,"  params");
        let userId = req.params.id
        adminHelper.blockUser(userId).then((response) => {
            // console.log(response+"  user blocked");
            res.redirect('/admin/view-users')
        })
    },

    getUnBlockUser: (req, res, next) => {
        let userId = req.params.id
        adminHelper.unBlockUser(userId).then((response) => {
            console.log(response + "  user unblocked");
            res.redirect('/admin/view-users')
        })
    },

    getLogout: (req, res) => {
        req.session.isAdminLoggedIn = null
        req.session.admin = null
        res.redirect('/admin/login')
    }
}