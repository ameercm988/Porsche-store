const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');


const verifyLogin = ((req,res,next) => {
    if (req.session.isAdminLoggedIn) {
        next()
    }else{
        res.redirect('/admin/login')
    }
})

//>>>>>>>>>>>>>> adminSection

router.get('/login', adminController.getLogin)

router.post('/login', adminController.postLogin)

router.get('/',verifyLogin, adminController.getHome)

//>>>>>>>>>>>>>> productSection

router.get('/view-products', verifyLogin, adminController.getViewProducts)

router.get('/add-products', verifyLogin, adminController.getAddProducts)

router.post('/add-products', adminController.postAddProducts)

router.get('/edit-products/:id', verifyLogin, adminController.getEditProducts)

router.post('/edit-products/:id', adminController.postEditProducts)

// used query not params for delete products \/

router.get('/delete-products', adminController.getDeleteProducts)

//>>>>>>>>>>>>>> categorySection

router.get('/view-category', verifyLogin, adminController.getViewCategory)

router.get('/add-category', verifyLogin, adminController.getAddCategory)

router.post('/add-category', adminController.postAddCategory)

router.get('/edit-category/:id', verifyLogin, adminController.getEditCategory)

router.post('/edit-category/:id', adminController.postEditCategory)

// used query not params for delete category \/

router.get('/delete-category', adminController.getDeleteCategory)      

//>>>>>>>>>>>>>> userSection

router.get('/view-users', verifyLogin, adminController.getViewUsers)

router.get('/block-user/:id', verifyLogin, adminController.getBlockUser)

// router.get('/unblock-user/:id', verifyLogin, adminController.getUnBlockUser)

router.get('/view-orders/:id', verifyLogin, adminController.getViewOrders)

router.get('/view-order-products', verifyLogin, adminController.getOrderProducts)

router.get('/status', verifyLogin, adminController.getChangeStatus)

// router.get('/status-cancelled', verifyLogin, adminController.getChangeStatusCancelled)

// router.get('/status-delivered', verifyLogin, adminController.getChangeStatusDelivered)

//>>>>>>>>>>>>>> coupon section

router.get('/view-coupons', verifyLogin, adminController.getCoupons)

router.get('/generate-coupon', verifyLogin, adminController.getGenerateCoupon)

router.post('/generate-coupon', adminController.postGenerateCoupon)

router.get('/delete-coupon/:id', adminController.getDeleteCoupon)


//>>>>>>>>>>>>>> admin logout

router.get('/logout', adminController.getLogout)


module.exports = router;
