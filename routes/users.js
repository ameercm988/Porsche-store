const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')

/* GET home page. */

// router.get('/', (req, res, next) => {
//   res.render('users/users-index');
// });

router.get('/', usersController.getHome)


/* GET login page. */

// router.get('/login', (req, res, next) => {
//   res.render('users/users-login', {layout : 'users-layout'});
//   console.log("login");
// });

router.get('/login',usersController.getLogin)

/* POST login page. */

// router.post('/login', (req,res,next) => {
//  res.redirect('/')
// })

router.post('/login', usersController.postLogin)

/* GET signup page. */

// router.get('/signup', (req, res, next) => {
//   res.render('users/users-signup', {layout : 'users-layout'});
//   console.log("signup");
// });

router.get('/signup', usersController.getSignup)

/* POST signup page. */

// router.post('/signup',(req,res,next) => {
//  res.redirect('/login')
// })

router.post('/signup', usersController.postSignup)


// router.get('/logout',(req,res,next) => {
//   res.redirect('/login')
// })

router.get('/logout', usersController.getLogout)

module.exports = router;
