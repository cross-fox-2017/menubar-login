var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash')
var models = require('../models')


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login == true && req.session.admin == true){
    res.render('home',{title : "Welcome | Home"});
  }
  else if(req.session.login == true && req.session.admin == false){
    res.render('user',{title : "Welcome | Home"});
  }else{
  res.render('login',{title : "Welcome | Login"});
  }
});

router.get('/home', function(req, res, next) {
  if(req.sesion.login == true && req.session.admin == true){
    res.render('home',{title : "Welcome | Home"});
  }else{
    redirect('/')
  }
});

router.get('/user', function(req, res, next) {
  if(req.session.login == true && req.session.admin == false){
    res.render('user',{title : "Welcome | Home"});
  }else{
    redirect('/')
  }
});

router.get('/register', function(req, res, next) {
  res.render('register',{title : "Welcome | Register"});
});

router.post('/validation', function(req, res, next) {
  models.User.findOne({
    where:{
      username: req.body.username
    }
  }).then(function(data){

    if(passwordHash.verify(req.body.password, data.password) == true && data.role == "user"){
      req.session.login = true;
      req.session.admin = false;
      res.redirect('/')
    }
    else if(passwordHash.verify(req.body.password, data.password) == true && data.role == "admin"){
      req.session.login = true;
      req.session.admin = true;
      res.redirect('/')
    }
    else{
      res.redirect('/')
    }
  }).catch(

  )
});

router.post('/signup', function(req, res, next) {
  models.User.create({
    username: req.body.username,
    password: passwordHash.generate(req.body.password),
    email: req.body.email,
    role: req.body.role
  }).then(
    res.redirect('/')
  )
});

router.get('/logout', function(req, res, next){
  req.session.destroy()
  res.redirect('/')
});


module.exports = router;
