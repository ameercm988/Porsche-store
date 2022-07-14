const adminHelper = require('../helpers/adminHelper')
// const { doLogin } = require('../helpers/usershelper')

module.exports = {
    getLogin: (req,res) => {
        res.render('admin/admin-login', {layout : 'admin-layout'})
    },
    postLogin : (req,res,next) => {
        adminHelper.doLogin(req.body).then((adminInfo) => {
            if(adminInfo.isAdminValid){
                // res.render('admin/admin-index')
                res.render('admin/admin-index', {layout : 'admin-layout'})

            }else{
                res.redirect('/admin/')
            }
        }).catch((err) => {
            res.redirect('/admin/')
            console.log(err);
        })


        
    }
}