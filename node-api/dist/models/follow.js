import { db } from '../db';
import { User } from './user';
export const Follow = db.define('Follow', {});
Follow.belongsTo(User, { as: 'follower', foreignKey: 'follower_key' });
Follow.belongsTo(User, { as: 'following', foreignKey: 'following_key' });
