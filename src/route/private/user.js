const express = require('express')
const User = require('../../model/db/User')
const Role = require('../../model/db/Role')

const router = express.Router()

// GET /private/users/

router.get('/', (req, res) => {
  User.findAll()
    .then((users) => {
      if (users.length !== 0) res.status(200).json(users)
      else res.status(404).json({ message: `Can't find users` })
    })
    .catch((err) => {
      res.status(500).json({ error: err.name, message: err.message })
    })
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
// TODO: Add password hashing

router.post('/', (req, res) => {
  Role.findByPk(req.body.roleId)
    .then((role) => {
      if (role === null)
        res
          .status(404)
          .json({ message: `Can't find role with id: ${req.body.roleId}` })

      User.create({
        firstName: req.body.firstName,
        surname: req.body.surname,
        middleName: req.body.middleName,
        email: req.body.email,
        password: req.body.password,
        photoLink: req.body.photoLink,
        roleId: role.id,
      })
        .then((user) => {
          res.json({
            message: 'User was added successfully',
            user,
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
