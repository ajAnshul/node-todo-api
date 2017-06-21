const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');


const id = "594249b07915e0280ec8f21c";

Todo.find({_id:id}).then((res)=>{
  console.log("Todos ",res);
})

Todo.findOne({_id:id}).then((res)=>{
  console.log("Todos ",res);
})

Todo.findById(id).then((res)=>{
  if(res){
    console.log("Id not found");
  }
  console.log("Todos ",res);
}).catch((e)=>console.log(err))
