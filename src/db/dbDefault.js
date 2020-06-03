const db = require('./database')
const Role = require('../model/Role')
const rolesConfig = require('../config/rolesConfig')
const TaskColumn = require('../model/TaskColumn')

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

module.exports.taskColumnDefault = async (projectId) => {
  let transaction
  try {
    const actions = []

    transaction = await db.transaction()

    actions.push(
      TaskColumn.create({ name: 'Not Started', projectId }, transaction)
    )
    actions.push(
      TaskColumn.create({ name: 'In Progress', projectId }, transaction)
    )
    actions.push(TaskColumn.create({ name: 'Done', projectId }, transaction))
    actions.push(transaction.commit())

    await Promise.all(actions)
    console.log('Added default values in task_column table')
  } catch (err) {
    console.log(err)
    if (transaction) await transaction.rollback()
  }
}
