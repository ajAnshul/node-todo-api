const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populatesTodos, users, populatesUsers} = require('./seed/seed');

beforeEach(populatesUsers);

beforeEach(populatesTodos);
describe('POST todo/',()=>{

  it('Should create a new todo',(done)=>{
    var text = "Teting todo by mocha";
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err)
          return done(err);

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      })
  })

  // test for bad request
  it('Should give a error',(done)=>{
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res)=>{
        if(err)
          return done(err);
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>{
          return done(e);
        })
      })
  })
})


describe('GET todos',(done)=>{
  it('Should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
})

describe('GET todos/id',()=>{
  it('Should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })
  it('Should return 404 id not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(400)
      .end(done);
  })

  it('Shoud return 404 if ObjectID is not valid',(done)=>{
    request(app)
      .get(`/todos/123`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(400)
      .end(done);
  })
})

describe('Delete todo/:id',()=>{
  it('Should remove todo by id',(done)=>{
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err,res)=>{
        if(err)
          return done(err);
        // query db using findByid and it should fell

        Todo.findById(hexId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e))
      })
  })

  it('Should return 400 if id not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(400)
      .end(done);

  })

  it('Should return 400 if object id is invalid',(done)=>{
    request(app)
      .delete(`/todos/1243`)
      .expect(400)
      .end(done);
  })
})

describe('PATCH todos/:id',()=>{
  it('Should update todo by id',(done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = "this has done"
    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed:true,text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  })

  it('Should clear the completedAt when todo is not completed',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = "this has done"
    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed:false,text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  })
})

describe('GET user/me ',()=>{
  it('Should get user id and email if user is authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  })

  it('Should return empty object if user is not authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .expect(400)
      .expect((res)=>{
        expect(res.body.msg).toBe("got error");
      })
      .end(done);
  })
})

describe('Post /signup ',()=>{
  it('Should create a user',(done)=>{
    var email = "test6@gmail.com";
    var password = "abcddfg";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err)
          return done(err);
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  })

  it('Should return err if invalid email or password',(done)=>{
    var email = 'ldgk';
    var password = 'slfdgldfkg';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  })
  it('Shoud return duplate email if email is duplate',(done)=>{
    var email = 'test1@gmail.com';
    var password = 'ldfkgdlfg';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  })
})

describe('POST /login',()=>{
  it('Should return user with token if credentials is valid',(done)=>{
    request(app)
      .post('/login')
      .send({email:users[0].email, password:users[0].password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  })
  it('Should return error if credentials are not valid',(done)=>{
    request(app)
      .post('/login')
      .send({email:users[0].email, password:users[0].password+'lfg'})
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(done);  })
})
describe('DELETE logout',()=>{
  it('Should remove the token',(done)=>{
    request(app)
      .delete('/logout')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .end((err, res)=>{
        if(err)
          done(err)
        User.findById({_id:users[0]._id}).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>{
          done(e);
        })
      })
  })
})
