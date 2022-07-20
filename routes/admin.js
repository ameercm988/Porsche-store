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

router.get('/logout', adminController.getLogout)


module.exports = router;
