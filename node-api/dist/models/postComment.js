import { DataTypes } from 'sequelize';
import { db } from '../db';
import { User } from './user';
import { Post } from './post';
export const PostComment = db.define('PostComment', {
    content: {
        type: DataTypes.STRING,
        // allowNull defaults to true
    },
}, {
// Other model options go here
});
PostComment.belongsTo(Post);
PostComment.belongsTo(User);
