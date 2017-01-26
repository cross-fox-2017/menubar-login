var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
const models = require("../models")

// var getpasswordHash = require('./lib/password-hash');

/* GET users listing. */
router.post('/', function(req, res, next) {
    var user = req.body.user
    var password = req.body.password
    var roleid = req.body.roleid
    models.User.findOne({
        where: {
            user: user
        }
    }).then(function(getData) {
        if (getData) {
            if (getData.user == user && passwordHash.verify(password,getData.password) == true && roleid == "Admin") {
                req.session.level = "admin"
                res.redirect('/adminpanel')
            } else if (getData.user == user && passwordHash.verify(password,getData.password) == true && roleid == "User") {
                req.session.level = "user"
                res.redirect('/user')
            } else {
                console.log("Cek Input User dan Password");
            }
        } else {
            console.log("User Tidak Tersedia");
        }
    })
})

router.get('/', function(req, res, next) {
    res.render('index');
});
router.get('/adminpanel', function(req, res, next) {
    if(req.session.level == "admin"){
        res.render('adminpanel');
    }else if(req.session.level == "user"){
        res.redirect('/user')
    }else{
      res.redirect('/')
    }

});
router.get('/user', function(req, res, next) {
  if(req.session.level == "admin" || req.session.level == "user"){
      res.render('user');
  }else{
      res.redirect('/')
  }

});

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.get('/logout', function(req, res, next) {
    req.session.destroy()
    res.redirect('/');
});


router.post('/register', function(req, res, next) {
    // create a new user
    models.User.create({
        user: req.body.user,
        password: passwordHash.generate(req.body.password),
        RoleId: req.body.roleid
    }).then(function() {
        console.log("Saving New User");
        res.redirect('/')
    })
})

module.exports = router;
