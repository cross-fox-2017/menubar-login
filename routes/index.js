const express = require('express');
const router = express.Router();
const models = require("../models");
var passwordHash = require('password-hash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages', { title: 'Login' });
});

router.get('/home', function(req, res, next) {
  if(req.session.isLogin){
    models.Users.find({where:{id: req.session.pk}}).then(function (find){
      res.render('pages/home', { title: 'Home Page', nama: find.username, role: find.role});
    });
  } else {
    res.redirect('/');
  }
});

router.post('/check_login', function(req, res, next) {
  models.Users.find({where:{username: req.body.username}}).then(function (find){
    if (passwordHash.verify(req.body.password, find.password) === null) {
      res.redirect(`/`)
    } else {
      req.session.isLogin = true;
      req.session.pk = find.id;
      res.redirect('/home');
    }
  });
});

router.get('/register', function(req, res, next) {
    res.render('pages/register', { title: 'Register' });
});

router.get('/logout', function(req, res, next) {
  req.session.isLogin = false;
  req.session.nama = ""
  res.redirect('/')
});

router.post('/create', function(req, res, next) {
  models.Users.create({username: req.body.username, email: req.body.email, password: passwordHash.generate(req.body.password), role: req.body.role, createdAt: new Date()}).then(function () {
    res.redirect(`/`)
  })
});
module.exports = router;
