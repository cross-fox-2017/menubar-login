var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var User = require('../models').User

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.cek){
    res.send('LOGIN DULU');
  }
  res.render('home')
});

router.post('/', function(req, res, next) {
  let user = req.body.username
  let pass = req.body.password
  User.find({where: {username: user}}).then(function(user){
    if(!user){
      res.render('index', {title: 'username/password salah'})
    }
    if (passwordHash.verify(pass, user.password)){
      req.session.cek = true
      res.redirect('/users')
    } else {
      res.render('index', {title: 'username/password salah'})
    }
  })
});

module.exports = router;
