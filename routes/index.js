var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var User = require('../models').User

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register')
});

router.post('/register', function(req, res, next){
  let user = req.body.user
  let pass = passwordHash.generate(req.body.pass);
  let email = req.body.email
  User.create({
    username: user,
    password: pass,
    email: email
  }).then(function(newuser){
    res.redirect('/')
  })
});

router.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
    res.redirect('/')
  })
})

module.exports = router;
