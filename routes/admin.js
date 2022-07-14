const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('admin/admin-login', {layout : 'admin-layout'});
//   console.log("admin");
// });

router.get('/', adminController.getLogin)



// router.post('/login',(req,res,next) => {
//   res.render('admin/admin-index', {layout : 'admin-layout'})
// })

router.post('/login', adminController.postLogin)

router.get('/logout', (req,res) => {
  res.redirect('/admin/')
})

module.exports = router;
