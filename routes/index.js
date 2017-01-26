var express = require('express');
var router = express.Router();
const models = require('../models');
const hash = require('password-hash');
var user = models.User;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'BLOLPAGE' });
});

router.post('/create', function(req, res) {
  user.create({
    username: req.body.username,
    email: req.body.email,
    hash: hash.generate(req.body.password),
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  }).then(function(result){
    res.redirect('/user')
  })
});

router.post('/createadmin', function(req, res) {
  user.create({
    username: req.body.username,
    email: req.body.email,
    hash: hash.generate(req.body.password),
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  }).then(function(result){
    res.render('admin')
  })
});

router.get('/', function (req,res) {
  if (req.session.loggedin == true && req.session.admin == true) {
    res.redirect('/admin')
  } else if (req.session.loggedin == true && req.session.admin != true) {
    res.redirect('/user')
  } else {
    res.render('index')
  }
})

router.post('/login', function (req, res) {
  user.findOne({
    where: {
      username: req.body.username
    }
  }).then(function(username) {
    if(username == null) {
      res.redirect('/')
    }
    var verify = hash.verify(req.body.password, username.hash)
    if( verify == true && username.role === 'admin') {
      req.session.loggedin = true
      req.session.admin = true
      console.log(req.session)
      res.redirect('/admin')
    } else if (verify == true && username.role === 'user') {
      req.session.loggedin = true
      req.session.admin = false
      res.redirect('/user')
    } else {
      res.redirect('/')
    }
  })
})

// router.get('/redirects', function(req, res) {
//   if (req.session.loggedin == true && req.session.admin == true) {
//     res.redirect('/admin')
//   } else if (req.session.loggedin == true && req.session.admin == false) {
//     res.redirect('/user')
//   }
//   else {
//     res.redirect('/')
//   }
// });

router.get('/admin', function (req, res) {
  if (req.session.loggedin == true) {
    res.render('admin',{title: "admin page"})
  }
  else {
    res.redirect('/')
  }
})

router.get('/user', function (req, res) {
  if (req.session.loggedin == true) {
    res.render('user',{title: "admin page"})
  }
  else {
    res.redirect('/')
  }
})

router.get('/logout', function (req,res) {
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
