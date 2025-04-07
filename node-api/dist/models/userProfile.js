import { DataTypes } from 'sequelize';
import { db } from '../db';
export const UserProfile = db.define('UserProfile', {
    biogram: {
        type: DataTypes.STRING,
        // allowNull: false
    },
    birthdate: {
        type: DataTypes.DATE
    },
    location: {
        type: DataTypes.STRING
    }
}, {
// Other model options go here
});
