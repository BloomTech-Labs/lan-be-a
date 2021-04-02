const express = require('express');

const app = express.Router();
const Roles = require('../models/role');

app.get('/', async (request, response)=>{
  // if(request.user.permissions["UU"] !== true) return response.status(403).json({message: "You are not allowed to perform this action"});
  const roles = await Roles.fetchAll();
  response.status(200).json({roles});
});

app.post('/', async (request, response)=>{
  const {name, permissions} = request.body;
  const newRole = await Roles.create(name, permissions);
  if(!newRole) return response.status(400).json({message: `Role "${name}" already exists`});
  response.status(201).json({role: newRole});
});

app.get('/:id', async (request, response)=>{
  // if(request.user.permissions["UU"] !== true) return response.status(403).json({message: "You are not allowed to perform this action"});
  const {id} = request.params;
  const role = await Roles.fetch(id);
  if(!role) return response.status(400).json({message: 'Invalid role id'});
  response.status(200).json({role});
});

app.put('/:id', async (request, response) => {
  // if(request.user.permissions["UU"] !== true) return response.status(403).json({message: "You are not allowed to perform this action"});
  const {id} = request.params;
  const updatedRole = await Roles.update(id, request.body);
  response.status(201).json({role: updatedRole});  
});

app.delete('/:id', async (request, response) => {
  // if(request.user.permissions["UD"] !== true) return response.status(403).json({message: "You are not allowed to perform this action"});
  const {id} = request.params;
  const deletedRole = await Roles.remove(id);
  if(!deletedRole) return response.status(400).json({message: 'This role cannot be deleted'});
  response.status(201).json({message: 'Role deleted', deletedRole});
});


module.exports = app;
