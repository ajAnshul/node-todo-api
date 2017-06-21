const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
var jwt = require('jsonwebtoken');

var userOne = new ObjectID();
var userTwo = new ObjectID();
const users = [{
  '_id':userOne,
  'email':"test1@gmail.com",
  'password':'userOnePass',
  'tokens':[
    {
      access:'auth',
      token:jwt.sign({'_id':userOne, access:'auth'},'1234')
    }
  ]
},
{
  '_id':userTwo,
  'email':"test2@gmail.com",
  'password':"userTwoPass",
  'tokens':[
    {
      access:'auth',
      token:jwt.sign({'_id':userTwo, access:'auth'},'1234')
    }
  ]
},

]


const todos = [
  {
    _id : new ObjectID(),
    text : "First todo test",
    creator:userOne
  },
  {
    _id : new ObjectID(),
    text:"Second todo test",
    completed:true,
    completedAt:123,
    creator:userTwo
  }
]

const populatesTodos = (done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(() => done());
}

const populatesUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(()=>done())
}

module.exports = {todos, populatesTodos, users, populatesUsers}
