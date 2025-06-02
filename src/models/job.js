'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.User, { foreignKey: 'recruiterId' });
      Job.hasMany(models.Application, { foreignKey: 'jobId' })

    }
  }
  Job.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    recruiterId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'jobs',
    modelName: 'Job',
  });
  return Job;
};