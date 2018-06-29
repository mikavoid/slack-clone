module.exports = {
  Mutation: {
    createMessage : async (parent, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id })
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    }
  }
}