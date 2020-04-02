const dataType = require('sequelize').DataTypes

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('apiKeys', 'createdAt', { transaction: t }),
        queryInterface.removeColumn('apiKeys', 'updatedAt', { transaction: t }),
      ])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'apiKeys',
          'createdAt',
          {
            type: dataType.TIME,
            allowNull: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'apiKeys',
          'updatedAt',
          {
            type: dataType.TIME,
            allowNull: false,
          },
          {
            transaction: t,
          }
        ),
      ])
    })
  },
}
