const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

//todo.remove() will remove all the record which will match

Todo.remove({}).then((res)=>{
  console.log(res);
})

//todo.findOneAndRemove()
// todo.findByIdAndRemove()
