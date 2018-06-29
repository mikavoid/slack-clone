const { tryLogin } = require('../services/auth')
const formatErrors = require('../utils/formatErrors')

module.exports = {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id }}),
    getAllUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) => {
      const x = await tryLogin(email, password, models, SECRET, SECRET2)
      console.log(x)
      return x
    },
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args)
        return {
          ok: true,
          user
        }
      } catch (e) { 
        console.log(e)
        return {
          ok: false,
          errors: formatErrors(e, models)
        }
      }
    }
  }
}