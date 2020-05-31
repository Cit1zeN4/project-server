const express = require('express')
const Task = require('../../model/Task')
const TaskColumn = require('../../model/TaskColumn')
const User = require('../../model/User')

const router = express.Router()

// GET /private/task/

router.get('/', (req, res, next) => {
  Task.findAll()
    .then((tasks) => {
      res.json(tasks)
      return res.status(404).json({ message: `Can't find tasks` })
    })
    .catch((err) => {
      next(err)
    })
})

// GET /private/task/:id

router.get('/:id', (req, res, next) => {
  Task.findByPk(req.params.id)
    .then((task) => {
      if (task === null)
        res
          .status(404)
          .json({ message: `Can't find task with id: ${req.params.id}` })

      res.json(task)
    })
    .catch((err) => {
      next(err)
    })
})

// POST /private/task/

router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body)

    if (!task)
      return res.status(400).json({ error: true, message: `Can't create task` })
    res.json({ message: `Task was created successfully`, task })
  } catch (err) {
    next(err)
  }
})

// PUT /private/task/:id

router.put('/:id', (req, res, next) => {
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
      next(err)
    })
})

// DELETE /private/task/:id

router.delete('/:id', (req, res, next) => {
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
      next(err)
    })
})

// GET /private/task/:taskId/users/

router.get('/:taskId/users', (req, res, next) => {
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
      next(err)
    })
})

// POST /private/task/:taskId/users/:userId

router.post('/:taskId/users/:userId', (req, res, next) => {
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
              next(err)
            })
        })
        .catch((err) => {
          next(err)
        })
    })
    .catch((err) => {
      next(err)
    })
})

// DELETE /private/task/:taskId/users/:userId

router.delete('/:taskId/users/:userId', (req, res, next) => {
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
              next(err)
            })
        })
        .catch((err) => {
          next(err)
        })
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const tasks = await TaskColumn.findAll({
      order: [['id', 'ASC']],
      where: {
        projectId: req.params.projectId,
      },
      include: [
        {
          model: Task,
          include: [
            {
              model: User,
              as: 'owner',
              attributes: {
                exclude: ['password'],
              },
            },
            {
              model: User,
              through: { as: 'users' },
              attributes: {
                exclude: ['password'],
              },
            },
          ],
        },
      ],
    })

    if (!tasks.length)
      res.status(404).json({ error: true, message: `Can't find Tasks` })

    res.json(tasks)
  } catch (err) {
    next(err)
  }
})

router.post('/project/:projectId/column', async (req, res, next) => {
  try {
    const column = await TaskColumn.create({
      name: req.body.name,
      projectId: req.params.projectId,
    })

    return res.json(column)
  } catch (err) {
    next(err)
  }
})

router.delete(
  '/project/:projectId/column/:columnId',
  async (req, res, next) => {
    try {
      const column = await TaskColumn.destroy({
        where: {
          projectId: req.params.projectId,
          id: req.params.columnId,
        },
      })

      if (!column)
        return res
          .status(400)
          .json({ error: true, message: `Can't delete column` })

      return res.json({ message: `Column was successfully deleted` })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
