const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


app.use(bodyParser.json())


app.post('/todos',(req, res, next)=>{
  console.log(req.body);
  var newTodo = new Todo({
    text:req.body.text
  })
  newTodo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  })
})




app.listen(port,()=>{
  console.log("Server is running on ",port);
});
