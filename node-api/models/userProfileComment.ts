import { DataTypes } from 'sequelize';
import { db } from '../db';
import { User } from './user';

export const UserProfileComment = db.define(
    'UserProfileComment',
    {
        content: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
    },
    {
        // Other model options go here
    }
);

UserProfileComment.belongsTo(User, { as: 'sender', foreignKey: 'sender_key' });
UserProfileComment.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_key' });

