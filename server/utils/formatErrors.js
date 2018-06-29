const _ = require('lodash')
const formatErrors = (e, models) => {
  console.log('e',e)
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']))
  }
  return [{ path: 'name', message: 'something went wrong'}]
}

module.exports = formatErrors
