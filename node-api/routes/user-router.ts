import { Router, Request, Response } from 'express';
import { Op, ValidationError, where, fn, col } from 'sequelize';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middlewares/authMiddleware';
import { getUserFromRequest } from '../utils/getUserFromRequest';
import { IUser } from '../types';
import { Follow } from '../models/follow';
import { UserAttributes, UserResponse } from '../interfaces';
import { Post } from '../models/post';
import { getTokenFromRequest } from '../utils/getTokenFromRequest';
import { UserProfileComment } from '../models/userProfileComment';
import { log } from 'console';

const userRouter = Router();

userRouter.get('/', authenticate, (req: Request, res: Response) => {
    res.json({
        statusCode: 200,
        statusMessage: 'dziala',
    });
});

userRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password, repeatedPassword, firstName, lastName } =
        req.body;

    if (password !== repeatedPassword) {
        return res.status(400).send({ message: 'Hasła różnią się od siebie.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const createdUser = await User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });
        if (!createdUser) {
            throw new Error()
        }
        res.send(createdUser);
    } catch (e) {
        if (e instanceof ValidationError) {
            res.send({ message: 'Użytkownik o takim loginie już istnieje.' });
        } else {
            res.send({ message: 'Nieznany błąd.', error: e });
        }
    }
});

userRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const foundUser = await User.findOne({
        where: {
            username,
        },
    });

    if (!foundUser) {
        return res.status(404).send({ message: 'Nie ma takiego użytkownika.' });
    }

    const userDeserialized = foundUser.toJSON();

    const hashedPassword = userDeserialized.password;
    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordValid) {
        return res.status(404).send({ message: 'Nieprawidłowe hasło.' });
    }

    const followers = await Follow.findAll({
        include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            following_key: userDeserialized.id,
        },
    });

    const followedUsers = await Follow.findAll({
        include: {
            model: User,
            as: 'following',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            follower_key: userDeserialized.id,
        },
    });

    const userResponse: UserResponse = {
        firstName: userDeserialized.firstName,
        lastName: userDeserialized.lastName,
        userId: userDeserialized.id,
        biogram: userDeserialized.biogram,
        birthDate: userDeserialized.birthdate,
        location: userDeserialized.location,
        picture: userDeserialized.profilePicture,
        followers: followers.map((elem) => elem.toJSON()['follower']),
        following: followedUsers.map((elem) => elem.toJSON()['following']),
    };

    res.send({ user: userResponse, token: generateAccessToken(userResponse) });
});

/**
 * body {
 *      phrase: string
 * }
 */
userRouter.get(
    '/search-users',
    authenticate,
    async (req: Request, res: Response) => {
        const phrase = req.query.phrase.toString();

        try {
            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        // find users by firstName
                        {
                            firstName: where(
                                fn('LOWER', col('firstName')),
                                'LIKE',
                                '%' + phrase.toLowerCase() + '%'
                            ),
                        },
                        // find users by lastName
                        {
                            lastName: where(
                                fn('LOWER', col('lastName')),
                                'LIKE',
                                '%' + phrase.toLowerCase() + '%'
                            ),
                        },
                        // find users by firstName + lastName
                        where(
                            fn(
                                'LOWER',
                                fn('concat', col('firstName'), col('lastName'))
                            ),
                            'LIKE',
                            '%' + phrase.replaceAll(' ', '').toLowerCase() + '%'
                        ),
                    ],
                },
                attributes: ['id', 'firstName', 'lastName'],
            });
            res.send({ users });
        } catch (e) {
            res.status(400).send({ error: e });
        }
    }
);

/**
 * body {
 *      userId: number
 * }
 */
userRouter.post(
    '/follow-user',
    authenticate,
    async (req: Request, res: Response) => {
        const user = getUserFromRequest(req) as IUser;
        const userId = user.userId;
        const userIdToFollow = req.body.userId;

        // nie mozna obserwowac samego siebie
        if (userId === userIdToFollow) {
            return res.sendStatus(400);
        }

        const follow = await Follow.create({
            follower_key: userId,
            following_key: userIdToFollow,
        });

        return res.send({ follow });
    }
);

/**
 * body {
 *      userId: number
 * }
 */
userRouter.post(
    '/unfollow-user',
    authenticate,
    async (req: Request, res: Response) => {
        const user = getUserFromRequest(req) as IUser;
        const userId = user.userId;
        const userIdToUnFollow = req.body.userId;
        console.log("dupa");
        
        console.log(userId, userIdToUnFollow)

        const recordsDeleted = await Follow.destroy({
            where: {
                follower_key: userId,
                following_key: userIdToUnFollow,
            },
        });
        if (!recordsDeleted) {
            return res.sendStatus(400);
        }

        return res.send({status: 'git'});
    }
);

/**
 * body {
 *      userId: number
 * }
 */
userRouter.get(
    '/user-profile/:userId',
    authenticate,
    async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'firstName', 'lastName', 'biogram', 'birthdate', 'location', 'profilePicture'],
        });

        if (!user) {
            res.status(404).send('user not found');
        }

        const userPosts = await Post.findAll({
            where: {
                UserId: userId,
            },
        });

        const followers = await Follow.findAll({
            include: {
                model: User,
                as: 'follower',
                attributes: ['id', 'firstName', 'lastName'],
            },
            where: {
                following_key: userId,
            },
        });
    
        const followedUsers = await Follow.findAll({
            include: {
                model: User,
                as: 'following',
                attributes: ['id', 'firstName', 'lastName'],
            },
            where: {
                follower_key: userId,
            },
        });


        res.send({ user: {...user.toJSON(), followedUsers, followers}, userPosts });
    }
);

userRouter.get(
    '/get-current-user',
    async (req: Request, res: Response) => {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.sendStatus(401);
        }
        const user = jwt.verify(token, process.env.TOKEN_SECRET!) as IUser

        if (user) {
            console.log(user)
            const userData = await User.findOne({where : {id: user.userId}})
            const followers = await Follow.findAll({
                include: {
                    model: User,
                    as: 'follower',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                where: {
                    following_key: user.userId,
                },
            });
        
            const followedUsers = await Follow.findAll({
                include: {
                    model: User,
                    as: 'following',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                where: {
                    follower_key: user.userId,
                },
            });

            return res.send({ user: {...userData.toJSON(), followedUsers, followers}, followedUsers, followers });
        }

        return res.sendStatus(404)
    }
);

userRouter.post(
    '/comment-user',
    authenticate,
    async (req: Request, res: Response) => {
        const commentContent = req.body.content;
        const commentedUserId = req.body.commentedUserId
        const user = getUserFromRequest(req);

        if (!commentContent || !commentedUserId) {
            return res.sendStatus(400)
        }
        const userComment = await UserProfileComment.create({
            receiver_key: commentedUserId,
            content: commentContent,
            sender_key:  user?.userId
        })


        res.send({userComment});
    }
);

userRouter.get(
    '/get-profile-comments/:userId',
    authenticate,
    async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const comments = await UserProfileComment.findAll({
                include: {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName']
                },
            where: {
                receiver_key: userId,
            },
        });
        res.send({comments});
    }
)

userRouter.patch(
    '/change-data',
    authenticate,
    async (req: Request, res: Response) => {
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const birthDate = req.body.birthDate
        const location = req.body.location;
        const biogram = req.body.biogram;
        const picture = req.body.picture
        const userId = getUserFromRequest(req).userId;
        const userUpdate = await User.update({
            firstName: firstName,
            lastName: lastName,
            birthdate: birthDate,
            location: location,
            biogram: biogram,
            profilePicture: picture
        }, {
            where: {
                id: userId,
            },
        })

        res.send({ userUpdate })
    })


function generateAccessToken(user: UserAttributes) {
    return jwt.sign(user, process.env.TOKEN_SECRET!, { expiresIn: '9999999s' });
}

export { userRouter };
