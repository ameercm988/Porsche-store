const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');


router.get('/login', adminController.getLogin)

router.post('/login', adminController.postLogin)

router.get('/', adminController.getHome)

router.get('/logout', adminController.getLogout)


module.exports = router;
