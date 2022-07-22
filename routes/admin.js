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



router.get('/login', adminController.getLogin)

router.post('/login', adminController.postLogin)

router.get('/',verifyLogin, adminController.getHome)

router.get('/view-products', verifyLogin, adminController.getViewProducts)

router.get('/add-products', verifyLogin, adminController.getAddProducts)

router.post('/add-products', adminController.postAddProducts)

router.get('/edit-products/:id', verifyLogin, adminController.getEditProducts)

router.post('/edit-products/:id', adminController.postEditProducts)

router.get('/delete-products', adminController.getDeleteProducts)

router.get('/view-users', verifyLogin, adminController.getViewUsers)

router.get('/block-user/:id', verifyLogin, adminController.getBlockUser)

router.get('/unblock-user/:id', verifyLogin, adminController.getUnBlockUser)

router.get('/logout', adminController.getLogout)


module.exports = router;
