const express = require('express')
const Project = require('../../model/db/Project')
const User = require('../../model/db/User')
const UserProject = require('../../model/db/UserProject')

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

// GET private/project/:id/users/

router.get('/:id/users/', (req, res) => {
  Project.findByPk(req.params.id, {
    include: [{ model: User }],
  })
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

// POST private/project/:projectId/users/:userId

router.post('/:projectId/users/:userId', (req, res) => {
  Project.findByPk(req.params.projectId)
    .then((project) => {
      if (project === null)
        res.status(404).json({
          message: `Can't find project with id: ${req.params.projectId}`,
        })
      User.findByPk(req.params.userId)
        .then((user) => {
          if (user === null)
            res.status(404).json({
              message: `Can't find user with id: ${req.params.userId}`,
            })
          project
            .addUser(user)
            .then(
              res.json({ message: `User was added to project successfully` })
            )
            .catch((err) => {
              res.status(500).json({ error: err.name, message: err.message })
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

// DELETE /private/project/:projectId/users/:userId

router.delete('/:projectId/users/:userId/', (req, res) => {
  Project.findByPk(req.params.projectId)
    .then((project) => {
      if (project === null)
        res.status(404).json({
          message: `Can't find project with id: ${req.params.projectId}`,
        })
      project
        .getUsers({ where: { id: req.params.userId } })
        .then((users) => {
          if (users.length === 0)
            res.status(404).json({
              message: `Can't find user with id: ${req.params.userId}`,
            })
          users[0]
            .destroy()
            .then(() => {
              res.json({
                message: `User was deleted form project successfully`,
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
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

module.exports = router
