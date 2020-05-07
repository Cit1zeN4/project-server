const db = require('./database')
const Role = require('../model/Role')

module.exports.roleDefault = async () => {
  let transaction
  try {
    const roles = await Role.findAll()
    if (!roles.length) {
      transaction = await db.transaction()
      await Role.create({ id: 1, roleName: 'User' }, transaction)
      await Role.create({ id: 2, roleName: 'Admin' }, transaction)

      await transaction.commit()
      console.log('Added default values in Role table')
    }
  } catch (err) {
    console.log(err)
    if (transaction) await transaction.rollback()
  }
}
