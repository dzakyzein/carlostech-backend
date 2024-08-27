const { Sequelize } = require('sequelize');
const config = require('./config');

const db = new Sequelize(config[process.env.NODE_ENV]);

module.exports = db;
