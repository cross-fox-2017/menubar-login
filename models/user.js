'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    RoleId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};