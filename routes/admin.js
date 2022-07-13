const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-login', {layout : 'admin-layout'});
  console.log("admin");
});

router.post('/login',(req,res,next) => {
  res.render('admin/admin-index', {layout : 'admin-layout'})
})

module.exports = router;
