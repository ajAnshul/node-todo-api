const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '1234abc'
// bcrypt gen salt is diffrent all the time
bcrypt.genSalt(10,(err, salt)=>{
  bcrypt.hash(password,salt,(err, hash)=>{
    console.log(hash);
  })

})

var hashed ='$2a$10$Xg9atuYEvlkHLdjxpvBaluEkbagMEcq/uDMyNH/N1LGl5YaZHwkFW';

bcrypt.compare(password,hashed,(err, res)=>{
  if(err)
    console.log("not matched");
  console.log(res);
})

// var data = {
//   id:4
// }
//
// var token = jwt.sign(data,'abcd');
//
// var decoded = jwt.verify(token,'abcd');
//
// console.log(token);
//
// console.log(decoded);
