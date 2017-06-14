// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// two arguments firest is db url and second is callbeck with db instacce
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err)
    return console.log("Unable to connect with mongodb ",err); // return function preventing to execute other statemnet

  console.log("Connected to mongodb");
  // directly can create and inset data in db
  db.collection("Todos").insertOne({
    "text":"First document",
    "completed":"false"
  },(err, result) =>{
    if(err){
      return console.log("unable to insert todo");
    }
    // .ops give document which is inserted
    console.log(JSON.stringify(result.ops,undefined,2));
  })

  db.collection('Users').insertOne({
    name:"Anshul",
    age:25,
    location:"Bangalore"
  },(err, result)=>{
    if(err){
      return console.log("Unable to insert");
    }

    console.log(JSON.stringify(result.ops,undefined,3));
  })
  // close the connection

  db.close();
});
