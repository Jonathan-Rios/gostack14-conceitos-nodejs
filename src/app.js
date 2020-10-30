const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepositoryIndex( response, id ){
  const index = repositories.findIndex(repository => repository.id === id );

  if (index < 0) return response.status(400).json({ error: 'Repository not found.' }); // findIndex retorna -1 quando não encontra
  
  return index;
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } =  request.body;

  const repository = {
    id: uuidv4(), 
    title: title, 
    url: url, 
    techs: techs, 
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } =  request.body;
  const index = findRepositoryIndex(response, id); //obtém via index o repositório.

  let repository = repositories[index];
  
  repository = { ...repositories[index], title, url, techs };

  repositories[index] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = findRepositoryIndex(response, id); //obtém via index o repositório.

  repositories.splice(index, 1); //(indice, quantas-posições-remover)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = findRepositoryIndex(response, id); //obtém via index o repositório.
  const repository = repositories[index];
  
  repository.likes++;
  
  repositories[index]=repository;

  return response.json(repository);
});

module.exports = app;
