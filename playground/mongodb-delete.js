const {MongoClient} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log("Unable to connect with db");
  }

  console.log("db has connected");
  // // delete many
  // db.collection('Todos').deleteMany({text:"Eat lunch"}).then((res)=>{
  //   console.log(res);
  // })

  // // delete one
  // db.collection('Todos').deleteOne({text:"Eat lunch"}).then((res)=>{
  //   console.log(res);
  // })
  // findone and delete

  db.collection('Todos').findOneAndDelete({text:"Eat lunch"}).then((res)=>{
    console.log(res);
  })
})
