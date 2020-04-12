const express = require('express')
const User = require('../../model/db/User')
const Role = require('../../model/db/Role')

const router = express.Router()

// GET /private/users/

router.get('/', (req, res) => {
  User.findAll()
    .then((users) => {
      if (users.length !== 0) res.status(200).send(users)
      else res.status(404).json({ message: `can't found users` })
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// GET /private/users/:id

router.get('/:id', (req, res) => {
  User.findByPk(req.params.id)
    .then((user) => {
      if (user === null)
        res
          .status(404)
          .json({ message: `Can't find role with id: ${req.body.roleId}` })
      res.status(200).json(user)
    })
    .catch((err) => {
      res.status(500).json(`${err.name}: ${err.message}`)
    })
})

// POST /private/users/

router.post('/', (req, res) => {
  Role.findByPk(req.body.roleId)
    .then((role) => {
      if (role === null)
        res
          .status(404)
          .json({ message: `Can't find role with id: ${req.body.roleId}` })
      return role
    })
    .then(async (role) => {
      const user = await User.build({
        firstName: req.body.firstName,
        surname: req.body.surname,
        middleName: req.body.middleName,
        email: req.body.email,
        password: req.body.password,
        photoLink: req.body.photoLink,
      })
      user.set('roleId', role.id)
      user.save()
      return user
    })
    .then((user) => {
      res.json({
        message: 'User was added successfully',
        user,
      })
    })
    .catch((err) => {
      res.status(500).json(`${err.name}: ${err.message}`)
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
          .json({ message: `Can't found user with id: ${req.params.id}` })
    })
    .catch((err) => {
      res.status(500).json(`${err.name}: ${err.message}`)
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
        res.json(result)
      })
      .catch((err) => {
        res.status(500).json(`${err.name}: ${err.message}`)
      })
  })
})

module.exports = router