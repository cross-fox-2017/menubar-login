var express = require('express');
var router = express.Router();
var db = require('../models')
var passwordHash = require('password-hash');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('pages/form', { title: 'login' });
});

router.post('/add', function(req, res, next) {
  var hashedPassword = passwordHash.generate(req.body.password);
  db.User.create({username:req.body.username,email:req.body.email,password:hashedPassword,role:req.body.role}).then(function(){
    res.redirect('/');
  })
});

router.get('/login', function(req, res, next) {
  res.render('pages/login', { title: 'login' });
});

router.post('/login', function(req, res, next) {
  db.User.findOne({where:{username:req.body.username}}).then(function(x){
    if(x===null){
      res.redirect('/login')
    }
    else{
      if(passwordHash.verify(req.body.password,x.password)===true){
        req.session.login=true
        req.session.user= x.username
        if(x.role==='admin'){
          req.session.admin = true
          res.redirect('/admin')
        }
        else{
          req.session.admin = false
          res.redirect('/user')
        }
     }
     else{
       res.redirect('/login')
     }
    }
  })
});

router.get('/admin', function(req, res, next) {
  if(req.session.admin===true){
    res.render('pages/admin', { title: 'login' });
  }
  else{
    res.send('ANDA BUKAN ADMIN SADAR PAK')
  }
});

router.get('/user', function(req, res, next) {
  if(req.session.admin===false){
    res.render('pages/user', { title: 'login' });
  }
  else{
    res.send('ANDA ADMIN SADAR PAK')
  }
});

router.post('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/');
});



module.exports = router;
