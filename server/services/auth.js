const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign({
      user: _.pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '1h',
    }
  )

  const createRefreshToken = jwt.sign({
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    }
  )

  return [createToken, createRefreshToken]
}

const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0
  try {
    const { user: { id } } = jwt.decode(refreshToken)
    userId = id
  } catch (err) {
    return {}
  }

  if (!userId) {
    return {}
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true })

  if (!user) {
    return {}
  }

  const refreshSecret = user.password + SECRET2
  try {
    jwt.verify(refreshToken, refreshSecret)
  } catch (err) {
    return {}
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret)
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  }
}

const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true })
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'Wrong email' }]
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Wrong password'}]
    }
  }

  const refreshSecret = user.password + SECRET2
  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    ok: true,
    token,
    refreshToken
  }
}

module.exports = {
  createTokens,
  refreshTokens,
  tryLogin
}