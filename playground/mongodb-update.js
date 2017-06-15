const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log("Unable to connect to db");
  }
  console.log("Connected to db");

  db.collection('Todos').findOneAndUpdate({_id:new ObjectID("594139345c18e9145036c820")},{$set:{completed:true}},{returnOriginal:false}).then((res)=>{
    console.log(res);
  })
})
