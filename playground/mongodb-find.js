// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// two arguments firest is db url and second is callbeck with db instacce
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err)
    return console.log("Unable to connect with mongodb ",err); // return function preventing to execute other statemnet

  console.log("Connected to mongodb");
  db.collection('Todos').find({_id: new ObjectID('5941341c4b42a6215d4beed6')}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs));
  },(err)=>console.log("Unable to fetch"))
  // close the connection

  db.close();
});
