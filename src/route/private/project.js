const express = require('express')
const Project = require('../../model/db/Project')

const router = express.Router()

// GET /private/project/

router.get('/', (req, res) => {
  Project.findAll()
    .then((projects) => {
      if (projects.length !== 0) res.status(200).json(projects)
      else res.status(404).json({ message: `Can't find projects` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// GET /private/project/:id

router.get('/:id', (req, res) => {
  Project.findByPk(req.params.id)
    .then((project) => {
      if (project === null)
        res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })
      res.json(project)
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// POST /private/project/

router.post('/', (req, res) => {
  const project = Project.build({
    projectName: req.body.projectName,
    projectDescription: req.body.projectDescription,
    projectBudget: req.body.projectBudget,
    managerId: req.body.managerId,
  })
  project
    .save()
    .then((proj) => {
      res.json({ message: `Project was created successfully`, project: proj })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// PUT /private/project/:id

router.put('/:id', (req, res) => {
  Project.findByPk(req.params.id)
    .then((project) => {
      if (project === null)
        res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })
      project
        .update(req.body)
        .then((result) => {
          res.json({
            message: `Project was updated successfully`,
            project: result,
          })
        })
        .catch((err) => {
          res.status(500).json({ error: err.name, message: err.message })
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// DELETE /private/project/:id

router.delete('/:id', (req, res) => {
  Project.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      if (user) res.json({ message: `User was deleted successfully` })
      else
        res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

module.exports = router
