'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {

    static associate(models) {
      Application.belongsTo(models.User, { foreignKey: 'candidateId', as: 'candidate' });
      Application.belongsTo(models.Job, { foreignKey: 'jobId' })
    }

  }
  Application.init({
    jobId: DataTypes.INTEGER,
    candidateId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'applications',
    modelName: 'Application',
  });
  return Application;
};