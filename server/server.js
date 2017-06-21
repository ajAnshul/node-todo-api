const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate } = require('./middleware/authenticate');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


app.use(bodyParser.json())


app.post('/todos',authenticate,(req, res, next)=>{
  console.log(req.body);
  var newTodo = new Todo({
    text:req.body.text,
    creator:req.user._id
  })
  newTodo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  })
})

app.get('/todos',authenticate,(req, res, next)=>{
  Todo.find({
    creator:req.user._id
  }).then((todos)=>{
    res.send({todos})
  },(err)=>{
    res.status(400).send(err);
  })
})

app.get('/todos/:id',authenticate,(req, res, next)=>{
  var id = req.params.id

  if(!ObjectID.isValid(id)){
    return res.status(400).send({msg:"Invalid id"})
  }

  Todo.findOne({
    _id:id,
    creator:req.user._id
  }).then((todo)=>{
    if(!todo){
      res.status(400).send("Id not found")
    }
    res.send({todo});
  }).catch((e) => res.status(400).send(e))
})


app.delete('/todos/:id',(req, res, next)=>{
  // get the id
  var id = req.params.id;
  console.log("got hit");

  // validate the id
  if(!ObjectID.isValid(id)){
    return res.status(400).send({msg:"bad id"})
  }
  // remove todo by id

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      res.status(400).send({mgs:"todo id is not fount"})
    }
    res.send({todo})
  }).catch((e)=> res.status(400).send(e))
})

// to update patch

app.patch('/todos/:id',(req, res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(400).send({msg:"Invalid id"})
  }
  console.log(body);
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else{
    body.completedAt = null
    body.completed = false
  }
  console.log(body);
  Todo.findOneAndUpdate(id,{$set:body}, {new:true}).then((todo)=>{
    if(!todo){
      return res.status(400).send({msg:"id not found"})
    }
    res.send({todo})
  })
})

app.get('/users/me',authenticate,(req, res)=>{
  res.send(req.user);
})
// createuser
// two king of methods one is model method start with upper case like User and second is instance method like user
app.post('/users',(req, res)=>{
  var body = _.pick(req.body,['email', 'password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>res.status(400).send(e))
})

app.delete('/logout',authenticate,(req, res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.send();
  },(e)=>{
    res.status(400).send();
  })
})
app.post('/login',(req, res)=>{
  var body = _.pick(req.body,['email','password'])

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    })
  }).catch((err)=>{
    res.status(400).send();
  })

  // User.findOne({email}).then((user)=>{
  //   if(!user)
  //     res.status(400).send({"msg":"user not found"})
  //   res.send(user);
  // }).catch((e)=>{
  //   console.log("its' catch");
  //   res.status(400).send(" error from catch")
  // })
})



app.listen(port,()=>{
  console.log("Server is running on ",port);
});

module.exports = {app};
