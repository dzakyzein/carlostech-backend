'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Reservation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Lunas', 'Belum Lunas'),
        allowNull: false,
        defaultValue: 'Belum Lunas',
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      progress: {
        type: DataTypes.ENUM('0%', '25%', '50%', '75%', '100%'),
        defaultValue: '0%',
      },
      paymentProof: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paidOff: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Reservation',
    }
  );
  return Reservation;
};
