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

        productHelper.addProduct(req.body).then((id) => {
            

            // let file = req.files

            // for(i=1;i<=file;i++){

            // }


            let img1 = req.files.image1
            let img2 = req.files.image2
            let img3 = req.files.image3
            let img4 = req.files.image4

            img1.mv('./public/productImages/' +id+ '_1.jpg')
            img2.mv('./public/productImages/' +id+ '_2.jpg')
            img3.mv('./public/productImages/' +id+ '_3.jpg')
            img4.mv('./public/productImages/' +id+ '_4.jpg')

            res.redirect('/admin/view-products')

        }).catch((err) => {
            console.log(err+"file not recieved");
         })
    },

    getEditProducts : (req, res, next) => {
        let proId = req.params.id
        productHelper.editProducts(proId).then((products) => {
            res.render('admin/edit-products', {layout : 'admin-layout', products})
        })
        
    },

    postEditProducts : (req, res, next) => {
       let proId = req.params.id
       productHelper.updateProducts(proId, req.body).then((products) => {
        res.redirect('/admin/view-products')
        if(req.files.image1){
            let img1 = req.files.image1
            img1.mv('./public/productImages/' +id+ '_1.jpg')
        }
       })
    },

    getDeleteProducts : (req, res, next) => {
        proId = req.query.id
        productHelper.deleteProduct(proId).then((response) => {
            res.redirect('/admin/view-products')
        })
    },

    getLogout: (req, res) => {
        req.session.isAdminLoggedIn = null
        req.session.admin = null
        res.redirect('/admin/login')
    }
}