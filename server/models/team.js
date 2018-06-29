module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [3, 15],
          msg: 'Team name must be 3 o 15 characters long'
        }
      }
    }
  })

  Team.associate = (models) => {

    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    })
    // 1:m
    Team.belongsTo(models.User, {
      foreignKey: 'owner'
    })
  }

  return Team
}