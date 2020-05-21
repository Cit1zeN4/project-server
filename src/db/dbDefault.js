const db = require('./database')
const Role = require('../model/Role')
const rolesConfig = require('../config/rolesConfig')

module.exports.roleDefault = async () => {
  let transaction
  try {
    const roles = await Role.findAll()
    const actions = []

    if (!roles.length) {
      transaction = await db.transaction()

      rolesConfig.forEach((cRole) => {
        actions.push(
          Role.create({ id: cRole.id, roleName: cRole.name }, transaction)
        )
      })

      actions.push(transaction.commit())

      await Promise.all(actions)
      console.log('Added default values in Role table')
    }
  } catch (err) {
    console.log(err)
    if (transaction) await transaction.rollback()
  }
}
