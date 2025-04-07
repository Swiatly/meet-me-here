import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { log } from 'console';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send({ message: 'Unauthorized' });

    jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        async (err: any, user: any) => {
            if (err) return res.sendStatus(403);
            const userInDatabase = await User.findOne({
                where: {
                    id: user.userId,
                },
            });
            if (!userInDatabase) {
                return res.sendStatus(401);
            }
            next();
        }
    );
};
