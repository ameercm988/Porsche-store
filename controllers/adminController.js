// const express = require('express')
const adminHelper = require('../helpers/adminHelper')
const productHelper = require('../helpers/productHelper')
const categoryHelper = require('../helpers/categoryHelper')
const { response } = require('../app')


module.exports = {

    // admin section >>>>>>>>>>>>>>>>

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
        })
    },

    getHome: async (req, res, next) => {
        let orders = await adminHelper.getrecentOrders()
        // orders.date = orders[0].date.split("",2)
        // console.log(orders.date);
        if (orders.length > 5) {
            recentOrders = orders.slice(0, 5)
            res.render('admin/admin-index', { layout: 'admin-layout', recentOrders })
        }else{
            recentOrders = orders
            res.render('admin/admin-index', { layout: 'admin-layout', recentOrders }) 
        }
    },

    // product section >>>>>>>>>>>>>>>>>

    getViewProducts: (req, res, next) => {
        productHelper.getAllProducts().then((products) => {
            res.render('admin/view-products', { layout: 'admin-layout', products })
        })
    },

    getAddProducts: (req, res, next) => {
        categoryHelper.getAllCategory().then((category) => {
            res.render('admin/add-products', { layout: 'admin-layout', category, imageError: req.session.imageError })
            req.session.imageError = false
        })
    },

    postAddProducts: (req, res, next) => {
        const file = req.files.images
        if (file.length >= 3) {

            //If image didn't display while hosting remove map function

            let productImages = file.map(images => { return [images.name] });
            productHelper.addProduct(req.body, productImages).then((id) => {
                for (let i = 0; i < file.length; i++) {
                    file[i].mv('./public/productImages/' + id + i + ".jpg",)
                }
                res.redirect('/admin/view-products')
            }).catch((err) => {
                console.log(err + "file not recieved");
            })
        } else {
            req.session.imageError = 'Upload atleast three images'
            res.redirect('/admin/add-products')
        }
    },

    getEditProducts: (req, res, next) => {
        let proId = req.params.id
        productHelper.editProducts(proId).then((products) => {
            categoryHelper.getAllCategory().then((category) => {
                res.render('admin/edit-products', { layout: 'admin-layout', products, category })
            })
        })
    },

    postEditProducts: (req, res, next) => {
        const file = req.files.images
        if (file.length >= 3) {

            //  If image didn't display while hosting remove map function

            let newImages = file.map(images => { return [images.name] });
            let proId = req.params.id
            productHelper.updateProducts(proId, req.body, newImages).then((id) => {
                for (let i = 0; i < file.length; i++) {
                    file[i].mv('./public/productImages/' + proId + i + ".jpg",)
                }
                res.redirect('/admin/view-products')
            }).catch((err) => {
                console.log(err + "   file not recieved");
            })
        } else {
            req.session.imageError = 'Upload atleast three images'
            res.redirect('/admin/add-products')
        }
    },

    getDeleteProducts: (req, res, next) => {
        proId = req.query.id
        productHelper.deleteProduct(proId).then((response) => {
            res.redirect('/admin/view-products')
        })
    },

    // category section >>>>>>>>>>>>>>>>>

    getViewCategory: (req, res, next) => {
        categoryHelper.getAllCategory().then((category) => {
            res.render('admin/view-category', { layout: 'admin-layout', category })
            req.session.catError = false
        })
    },

    getAddCategory: (req, res, next) => {
        res.render('admin/add-category', { layout: 'admin-layout', categoryError: req.session.catError })
    },

    postAddCategory: (req, res, next) => {
        categoryHelper.addCategory(req.body).then((id) => {
            let catImg = req.files.categoryimage
            catImg.mv('./public/categoryImages/' + id + "CI.jpg")
            res.redirect('/admin/view-category')
        }).catch((err) => {
            req.session.catError = err
            res.redirect('/admin/add-category')
        })
    },

    getEditCategory: (req, res, next) => {
        catId = req.params.id
        categoryHelper.editCategory(catId).then((category) => {
            res.render('admin/edit-category', { layout: 'admin-layout', category })
        })
    },

    postEditCategory: (req, res, next) => {
        catId = req.params.id
        categoryHelper.updateCategory(catId, req.body).then(() => {
            res.redirect('/admin/view-category')
        })
    },

    getDeleteCategory: (req, res, next) => {
        let catId = req.query.id
        categoryHelper.deleteCategory(catId).then((response) => {
            res.redirect('/admin/view-category')
        })
    },

    // user section >>>>>>>>>>>>>>>>>>>>>>.

    getViewUsers: (req, res, next) => {
        adminHelper.viewUsers().then((users) => {
            res.render('admin/view-users', { layout: 'admin-layout', users })
        })
    },

    getBlockUser: (req, res, next) => {
        let userId = req.params.id
        adminHelper.blockUser(userId).then(() => {
            res.redirect('/admin/view-users')
        })
    },

    getViewOrders: async (req, res, next) => {
        let orders = await adminHelper.getUserOrders(req.params.id)
        res.render('admin/view-user-orders', { layout: 'admin-layout', orders })

    },

    getOrderProducts: async (req, res, next) => {
        let products = await adminHelper.getOrderProducts(req.query.id)
        res.render('admin/view-order-products', { layout: 'admin-layout', products })

    },

    getChangeStatus: (req, res, next) => {
        let orderId = req.query.id
        let userId = req.query.userId
        let status = req.query.status
        adminHelper.changeStatus(orderId, status).then((response) => {
            res.redirect('/admin/view-orders/' + userId)
        })
    },

    // coupon section >>>>>>>>>>>>>>>

    getCoupons: (req, res, next) => {
        adminHelper.getCoupons().then((coupons) => {
            console.log(coupons);
            res.render('admin/view-coupons', { layout: 'admin-layout', coupons })
        })
    },

    getGenerateCoupon: (req, res, next) => {

        res.render('admin/generate-coupon', { layout: 'admin-layout' })


    },

    postGenerateCoupon: (req, res, next) => {
        adminHelper.generateCoupon(req.body).then((response) => {
            res.redirect('/admin/view-coupons')
        })
    },

    getDeleteCoupon: (req, res, next) => {
        let couponId = req.params.id
        adminHelper.deleteCoupon(couponId).then((response) => {
            res.redirect('/admin/view-coupons')
        })
    },

    // logout >>>>>>>>>>

    getLogout: (req, res) => {
        req.session.isAdminLoggedIn = null
        req.session.admin = null
        res.redirect('/admin/login')
    }
}