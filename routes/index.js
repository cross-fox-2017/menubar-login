var express = require('express');
var router  = express.Router();
var models  = require("../models")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Menubar login' });
});

router.post('/login',function(req, res){
  models.User.findOne({
    where:{
      username:req.body.checkEmail
      password:req.body.checkPass
    }
  }).catch(function(err){
    res.send(err.message)
  }).then(function(dataUser){
    if(dataUser){
      req.session.username = dataUser.username
      req.session.password = dataUser.password

      res.send('/output')
    }else {
      res.redirect('/')
    }
  })
})

module.exports = router;
