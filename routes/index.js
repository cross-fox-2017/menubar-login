var express = require('express');
var router = express.Router();
let models = require('../models')
let hash = require('password-hash')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('pages/index');
});

router.get('/logout', function(req, res, next) {
  // console.log(req.session);
  req.session.destroy()
  res.redirect('/');
});

router.get('/home', function(req, res, next) {
  let idUser = req.session.userId;
  if(req.session.isLogin === true) {
    models.Users.findOne({
      where: {
        id: idUser
      }
    }).then(function (user) {
      if (user.role.toLowerCase() === 'admin') {
        models.Users.findAll({raw:true}).then(function (find) {
          res.render('pages/menuadmin', {users: find});
        })
      }
      else {
        res.render('pages/menu', {user: user});
      }
    })
  }
  else {
    res.render('pages/index');
  }
});

router.post('/login', function(req, res, next) {
  models.Users.findOne({where: {
    username: req.body.username,
  }}).then(function (user) {
    if (user !== null) {
      if (hash.verify(req.body.password, user.password)) {
        req.session.isLogin = true;
        req.session.userId = user.id;
        res.redirect('/home')
      }
      else {
        res.redirect('/');
      }
    }
    else {
      res.redirect('/');
    }
  })
});

router.get('/register', function (req, res, next) {
  res.render('pages/register');
})

router.post('/register', function(req, res, next) {
  models.Users.create({username: req.body.username, password: hash.generate(req.body.password), email: req.body.email, role: req.body.role}).then(function (data) {
    res.redirect('/')
  })
});

module.exports = router;
