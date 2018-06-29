module.exports = {
  Mutation: {
    createChannel : async (parent, args, { models }) => {
      try {
        await models.Channel.create(args)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    }
  }
}