var mongoose = require('mongoose')
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:"{value } is not a valid email"
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
})

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
   return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject)=>{
      bcrypt.compare(password,user.password,(err, res)=>{
        if(err){
          reject();
        }
        if(res){
          resolve(user)
        } else{
          reject();
        }
      })
    })
  })
}
// we have not user arrow function because arrow functin don't have this refrence\
// whatever you will add by methods turn to be methods of model

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token,'1234');
  }catch(e){
    // return new Promise((resolve, reject)=>{
    //   reject();
    // })
    return Promise.reject();
  }
  console.log("jwt verify",decoded);
  return User.findOne({
    _id : decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull:{
      tokens:{token}
    }
  })
}
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'1234');
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  })
}

UserSchema.pre('save',function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err, salt)=>{
      if(err){

      }
      bcrypt.hash(user.password,salt,(err, res)=>{
        user.password = res;
        next();
      })
    })
  }else{
    next();
  }
})

var User = mongoose.model('User',UserSchema)


module.exports = {User}
