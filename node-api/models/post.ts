import { DataTypes } from 'sequelize';
import { db } from '../db';
import { User } from './user';

export const Post = db.define(
    'Post',
    {
        // Model attributes are defined here
        title: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        photo: {
            type: DataTypes.STRING,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }
);

User.hasMany(Post);

Post.belongsTo(User);