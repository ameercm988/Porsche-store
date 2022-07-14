const usersHelper = require('../helpers/usersHelper');
// const adminHelper = require('../helpers/adminHelper');


module.exports = {
    getHome: (req, res, next) => {
            res.render('users/users-index')
    },
    getLogin: (req, res) => {
        res.render('users/users-login')
    },
    postLogin: (req, res, next) => {
            usersHelper.doLogin(req.body).then((userInfo) => {
                if(userInfo.isUserValid){
                    res.redirect('/')
                    console.log('logged in');
                }else{
                    res.redirect('/login')
                    console.log('not logged in');
                    console.log(userInfo);
                }
                
            }).catch((err) => {
                res.redirect('/login')
            })
            
    },
    getSignup: (req, res, next) => {
        res.render('users/users-signup')
    },
    postSignup: (req, res, next) => {
            usersHelper.doSignup(req.body).then((data) =>{
                res.redirect('/login')
            }).catch((err) => {
                res.redirect('/signup')
            })
    },
    getLogout: (req, res) => {
        res.redirect('/login')
    }



}