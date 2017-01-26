var express = require('express');
var router = express.Router();
let models = require('../models')
var app = express();
var passwordHash = require('password-hash');

/* GET users listing. */
router.get('/', function(req, res) {
  models.User.findAll({raw:true}).then(function(find){
    res.render("pages/menu", {data:find})
  })
});

router.get('/register', function(req, res, next) {
    res.render("pages/register")
});

router.post('/register', function(req, res, next) {
  let hashed = passwordHash.generate(req.body.password);
  models.User.create({username: req.body.username, email: req.body.email, password:hashed, role:req.body.role, createdAt: new Date()})
  .then(function (data) {
    res.redirect('/')
    })
});

router.post('/login', function(req, res, next) {
  let pwd = req.body.password
  let mail = req.body.email
  models.User.find({where:{email: mail}})
  .then(function (data) {
    if(passwordHash.verify(pwd, data.password)) {
      req.session.role = data.role
      let roles = req.session.role
      res.render("pages/home", {data:roles})
    }
  })
});

router.get('/out', function(req, res, next) {
    res.redirect('/')
});

module.exports = router;
