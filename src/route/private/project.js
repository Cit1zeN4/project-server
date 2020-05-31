const express = require('express')
const Project = require('../../model/Project')
const User = require('../../model/User')
const UserProject = require('../../model/UserProject')
const checkRole = require('../../middleware/checkRole')
const roles = require('../../config/rolesConfig')
const { taskColumnDefault } = require('../../db/dbDefault')

const router = express.Router()

// GET /api/project/

router.get('/', checkRole(roles.map((i) => i.name)), async (req, res, next) => {
  try {
    const projects = await Project.findAll()

    if (projects.length !== 0) return res.status(200).json(projects)
    return res.status(404).json({ message: `Can't find projects` })
  } catch (err) {
    next(err)
  }
})

// GET /api/project/:id

router.get(
  '/:id',
  checkRole(roles.map((i) => i.name)),
  async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.id)
      if (!project)
        return res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })

      return res.json(project)
    } catch (err) {
      next(err)
    }
  }
)

// POST /api/project/

router.post('/', checkRole(['manager', 'admin']), async (req, res, next) => {
  try {
    const project = await Project.create({
      projectName: req.body.projectName,
      projectDescription: req.body.projectDescription,
      managerId: req.body.managerId,
      dueDate: req.body.dueDate,
    })

    const columns = await taskColumnDefault(project.id)

    return res.json({
      message: `Project was created successfully`,
      project,
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/project/:id

router.put('/:id', checkRole(['manager', 'admin']), async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project)
      res
        .status(404)
        .json({ message: `Can't find project with id: ${req.params.id}` })

    const result = await project.update(req.body)

    return res.json({
      message: `Project was updated successfully`,
      project: result,
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /private/project/:id

router.delete(
  '/:id',
  checkRole(['manager', 'admin']),
  async (req, res, next) => {
    try {
      const result = await Project.destroy({
        where: {
          id: req.params.id,
        },
      })
      if (!result)
        return res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })

      return res.json({ message: `Project was deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
)

// GET private/project/:id/users/

router.get(
  '/:id/users/',
  checkRole(roles.map((i) => i.name)),
  async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [{ model: User }],
      })

      if (!project)
        return res
          .status(404)
          .json({ message: `Can't find project with id: ${req.params.id}` })

      return res.json(project.users)
    } catch (err) {
      next(err)
    }
  }
)

// POST private/project/:projectId/users/:userId

router.post(
  '/:projectId/users/:userId',
  checkRole(['manager', 'admin']),
  async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.projectId, {
        where: { projectId: req.params.projectId },
        include: [{ model: User }],
      })

      if (!project)
        return res.status(404).json({
          message: `Can't find project with id: ${req.params.projectId}`,
        })

      if (project.managerId === Number(req.params.userId))
        return res
          .status(400)
          .json({ error: true, message: `User already added to project` })

      const projectUser = project.users.filter(
        (user) => user.id === Number(req.params.userId)
      )
      if (projectUser.length)
        return res
          .status(400)
          .json({ error: true, message: `User already added to project` })

      const user = await User.findByPk(req.params.userId)

      if (!user)
        return res.status(404).json({
          message: `Can't find user with id: ${req.params.userId}`,
        })

      await project.addUser(user)

      await UserProject.update(
        { role: 'NoRole' },
        {
          where: {
            projectId: req.params.projectId,
            userId: req.params.userId,
          },
        }
      )

      const updatedUser = user.dataValues
      updatedUser.user_project = { role: 'NoRole' }

      return res.json({
        message: `User was added to project successfully`,
        user: updatedUser,
      })
    } catch (err) {
      next(err)
    }
  }
)

router.put(
  '/:projectId/users/:userId/',
  checkRole(['manager', 'admin']),
  async (req, res, next) => {
    try {
      const projectRole = await UserProject.findOne({
        where: {
          userId: req.params.userId,
          projectId: req.params.projectId,
        },
      })
      console.log(req.body)
      if (req.body.role) await projectRole.update({ role: req.body.role })
      return res.json(projectRole)
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /private/project/:projectId/users/:userId

router.delete(
  '/:projectId/users/:userId/',
  checkRole(['manager', 'admin']),
  async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.projectId)

      if (!project)
        res.status(404).json({
          message: `Can't find project with id: ${req.params.projectId}`,
        })

      const users = await project.getUsers({ where: { id: req.params.userId } })

      if (!users.length)
        res.status(404).json({
          error: true,
          message: `Can't find user with id: ${req.params.userId}`,
        })

      const result = await project.removeUser(users[0])

      if (!result)
        res.status(400).json({
          error: true,
          message: `Can't remove user with id: ${req.params.userId}`,
        })

      res.json({
        message: `User was deleted form project successfully`,
        userId: req.params.userId,
      })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
