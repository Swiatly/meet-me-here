import jwt from 'jsonwebtoken';
export const getUserFromRequest = (request) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return undefined;
    return jwt.decode(token);
};
