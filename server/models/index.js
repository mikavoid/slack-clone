const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = new Sequelize(config.db_database, config.db_username, config.db_password, {
  dialect: config.db_dialect,
  define: {
    underscored: true
  }
})

console.log('config', config)

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Team: sequelize.import('./team'),
  Message: sequelize.import('./message')
}

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models