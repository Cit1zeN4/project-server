const express = require('express')
const Task = require('../../model/Task')
const User = require('../../model/User')

const router = express.Router()

// GET /private/task/

router.get('/', (req, res) => {
  Task.findAll()
    .then((tasks) => {
      if (tasks.length !== 0) res.json(tasks)
      else res.status(404).json({ message: `Can't find tasks` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// GET /private/task/:id

router.get('/:id', (req, res) => {
  Task.findByPk(req.params.id)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.id}` })

      res.json(task)
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// POST /private/task/

router.post('/', (req, res) => {
  const task = Task.build({
    taskName: req.body.taskName,
    taskContent: req.body.taskContent,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    projectId: req.body.projectId,
    ownerId: req.body.ownerId,
  })
  task
    .save()
    .then((result) => {
      res.json({ message: `Task was created successfully`, task: result })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// PUT /private/task/:id

router.put('/:id', (req, res) => {
  Task.findByPk(req.params.id)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.id}` })
      task
        .update(req.body)
        .then((result) => {
          res.json({ message: `Task was updated successfully`, task: result })
        })
        .catch((err) => {
          res.status(500).json({ error: err.name, message: err.message })
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// DELETE /private/task/:id

router.delete('/:id', (req, res) => {
  Task.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((task) => {
      if (task) res.json({ message: `Task was deleted successfully` })
      else
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.id}` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// GET /private/task/:taskId/users/

router.get('/:taskId/users', (req, res) => {
  Task.findByPk(req.params.taskId)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.taskId}` })
      task
        .getUsers()
        .then((users) => {
          res.json(users)
        })
        .catch((err) => {
          res.status(500).json({ error: err.name, message: err.message })
        })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// POST /private/task/:taskId/users/:userId

router.post('/:taskId/users/:userId', (req, res) => {
  Task.findByPk(req.params.taskId)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.taskId}` })
      User.findByPk(req.params.userId)
        .then((user) => {
          if (user === null)
            res.status(404).json({
              message: `Can't find user with id: ${req.params.userId}`,
            })
          task
            .addUser(user)
            .then((result) => {
              res.json(result)
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

// DELETE /private/task/:taskId/users/:userId

router.delete('/:taskId/users/:userId', (req, res) => {
  Task.findByPk(req.params.taskId)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id ${req.params.taskId}` })
      task
        .getUsers({
          where: {
            id: req.params.userId,
          },
        })
        .then((users) => {
          if (!users.length)
            res
              .status(404)
              .json({ message: `Can't find user with id ${req.params.userId}` })

          const user = users[0]
          user
            .destroy()
            .then(() => {
              res.json({ message: `User was deleted from task successfully` })
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
