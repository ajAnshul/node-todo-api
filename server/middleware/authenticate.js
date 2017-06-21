var {User} = require('../models/user');
var authenticate = (req, res, next)=>{
  var token = req.header('x-auth');
  // user find by token which will take token search is that token is available or not
  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>{
    res.status(400).send({msg:"got error"})
  })
}

module.exports = {authenticate}
