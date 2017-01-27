var express = require('express');
var router  = express.Router();
var models  = require('../models')
/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/addRegister',function(req, res){
  models.User.create({
    username:req.body.inputUser,
    email:req.body.inputEmail,
    password:req.body.inputPass,
    role:req.body.role
  }).then(function(dataRegister){
    res.redirect('/')
  })
})

module.exports = router;
