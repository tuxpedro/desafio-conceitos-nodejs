const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getIndexProjectInRepository = (id, repositories) =>
  repositories.findIndex(({ id: uuid }) => uuid === id)

const isValidIdParam = id => isUuid(id)

const checksIfProjectExists = indexRepository => indexRepository >= 0;

app.get("/repositories", (request, response) => {
  return response.send(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  }

  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  if (!isValidIdParam(id)) return response
    .status(400)
    .json({ error: 'invalid parameter, check past data' })

  const projectIndex = getIndexProjectInRepository(id, repositories)

  const isProject = checksIfProjectExists(projectIndex)
  if (!isProject) return response.status(400).json({ error: 'Project not found' })

  const { likes } = repositories[projectIndex]

  const project = {
    id,
    url,
    title,
    techs,
    likes,
  }

  repositories[projectIndex] = project

  return response.json(project)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const projectIndex = getIndexProjectInRepository(id, repositories)

  if (!isValidIdParam(id)) return response
    .status(400)
    .send({ error: 'invalid parameter, check past data' })

  const isProject = checksIfProjectExists(projectIndex)
  if (!isProject) return response.status(400).send({ error: 'Project not found' })

  repositories.splice(projectIndex, 1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  if (!isValidIdParam(id)) return response
    .status(400)
    .json({ error: 'invalid parameter, check past data' })

  const projectIndex = getIndexProjectInRepository(id, repositories)

  const isProject = checksIfProjectExists(projectIndex)
  if (!isProject) return response.status(400).json({ error: 'Project not found' })

  repositories[projectIndex].likes++
  const project = repositories[projectIndex]
  return response.status(201).json(project)

});

module.exports = app;
