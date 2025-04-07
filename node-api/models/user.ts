import { DataTypes, Model } from 'sequelize';
import { db } from '../db';
import { Follow } from './follow';

export const User = db.define(
    'User',
    {
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        biogram: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE
        },
        location: {
            type: DataTypes.STRING
        },
        profilePicture: {
            type: DataTypes.STRING
        }
    },
    {
        // Other model options go here
    }
);


