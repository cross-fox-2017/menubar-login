var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var User = require('../models').User

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.cek){
    res.send('LOGIN DULU');
  }
  User.findAll({order: [['id', 'ASC']]}).then(function(data){
    res.render('home', {role: req.session.role, data: data})
  })
});

router.post('/update/updated/:id', function(req, res){
  let id = req.params.id
  let role = req.body.role
  User.findById(id).then(function(user){
    user.update({role: role}).then(function(){
      res.redirect('/users')
    })
  })
})

router.post('/update/:id', function(req, res){
  let id = req.params.id
  User.findById(id).then(function(user){
    res.render('update', {user: user})
  })
})

router.post('/', function(req, res, next) {
  let user = req.body.username
  let pass = req.body.password
  User.find({where: {username: user}}).then(function(user){
    if(!user){
      res.render('index', {title: 'username/password salah'})
    }
    if (passwordHash.verify(pass, user.password)){
      req.session.cek = true
      req.session.role = user.role
      res.redirect('/users')
    } else {
      res.render('index', {title: 'username/password salah'})
    }
  })
});

module.exports = router;
