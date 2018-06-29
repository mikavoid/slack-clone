const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require ('graphql-tools')
const path = require('path')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const config = require('./config')

const models = require('./models')
const addUser = require('./middlewares/addUser')(models)
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './definitions')), { all: true })
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))

const PORT = process.env.PORT || 4040


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
const app = express()
app.use(cors('*'))
app.use(bodyParser.json())
app.use(addUser)
const endpointURL = '/graphql'
app.use(endpointURL, graphqlExpress(req => ({
  schema,
  context: {
    models,
    SECRET: config.SECRET,
    SECRET2: config.SECRET_2,
    user : req.user
  }
})
))
app.use('/graphiql', graphiqlExpress({ endpointURL }))

models.sequelize.sync({}).then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
})