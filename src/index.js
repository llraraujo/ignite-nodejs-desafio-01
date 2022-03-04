const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers;
  
  const user = users.find(user => user.username === username)

  if(!user) return response.status(404).json({error: 'Mensagem do erro'})

  request.user = user

  return next();

  

}

app.post('/users', (request, response) => {
  // Complete aqui

  const {name, username} = request.body;

  if(!name || !username) return response.status(400).json({error: "Preencha todos os campos!"});

  const test = users.find(user => user.username === username) 
  
  if(test) return response.status(400).json({error: 'Mensagem do erro'})
  
  const user = {
      id: uuidv4(),
      name,
      username,
      todos:[]
    }


  users.push(user)

  console.log(users)
  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

    const { user }  = request;
   
    return response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  const {title, deadline} = request.body;

  if(!title || !deadline) return response.status(400).json({error: "Mensagem de erro"})

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }
  user.todos.push(todo)
    
  console.log(user)

  return response.status(201).json(todo)




});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({error: "Mensagem de erro"})

  const { title, deadline}  = request.body

  if(!title || !deadline) return response.status(404).json({error: "Mensagem de erro"})

  todo.title = title
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo)



});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request
  const { id } = request.params;


  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({error: "Mensagem de erro"})


  todo.done = true;

  return response.status(200).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({error: "Mensagem de erro"})

  user.todos.splice(todo)

  return response.status(204).json(todo)

});

module.exports = app;