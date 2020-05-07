const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../../model/User')
const Role = require('../../model/Role')

const router = express.Router()

// GET /private/users/

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    if (users.length === 0)
      res.status(404).json({ message: `Can't find users` })
    res.json(users)
  } catch (err) {
    // res.status(500).json(err)
    next(err)
  }
})

// GET /private/users/:id

router.get('/:id', (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (user === null)
        res
          .status(404)
          .json({ message: `Can't find user with id: ${req.params.id}` })
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// POST /private/users/
// TODO: the handler needs refactoring

router.post('/', (req, res) => {
  Role.findByPk(req.body.roleId)
    .then((role) => {
      if (role === null)
        res
          .status(404)
          .json({ message: `Can't find role with id: ${req.body.roleId}` })

      const slat = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(req.body.password, slat)

      User.create({
        firstName: req.body.firstName,
        surname: req.body.surname,
        middleName: req.body.middleName,
        email: req.body.email,
        password: hash,
        photoLink: req.body.photoLink,
        roleId: role.id,
      })
        .then((user) => {
          res.json({
            message: 'User was added successfully',
            user: user.id,
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

// DELETE /private/users/:id

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      if (user) res.json({ message: `User was deleted successfully ` })
      else
        res
          .status(404)
          .json({ message: `Can't find user with id: ${req.params.id}` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
})

// PUT /private/users/:id

router.put('/:id', (req, res) => {
  User.findByPk(req.params.id).then((user) => {
    if (user === null)
      res
        .status(404)
        .json({ message: `Can't find user with id: ${req.params.id}` })
    user
      .update(req.body)
      .then((result) => {
        res.json({ message: `User was updated successfully`, user: result })
      })
      .catch((err) => {
        res.status(500).json({ error: err.name, message: err.message })
      })
  })
})

module.exports = router
