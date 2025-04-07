var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { Op, ValidationError, where, fn, col } from 'sequelize';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middlewares/authMiddleware';
import { getUserFromRequest } from '../utils/getUserFromRequest';
import { Follow } from '../models/follow';
import { Post } from '../models/post';
import { getTokenFromRequest } from '../utils/getTokenFromRequest';
import { UserProfileComment } from '../models/userProfileComment';
const userRouter = Router();
userRouter.get('/', authenticate, (req, res) => {
    res.json({
        statusCode: 200,
        statusMessage: 'dziala',
    });
});
userRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, repeatedPassword, firstName, lastName } = req.body;
    if (password !== repeatedPassword) {
        return res.status(400).send({ message: 'Hasła różnią się od siebie.' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const createdUser = yield User.create({
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });
        if (!createdUser) {
            throw new Error();
        }
        res.send(createdUser);
    }
    catch (e) {
        if (e instanceof ValidationError) {
            res.send({ message: 'Użytkownik o takim loginie już istnieje.' });
        }
        else {
            res.send({ message: 'Nieznany błąd.', error: e });
        }
    }
}));
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const foundUser = yield User.findOne({
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
    const followers = yield Follow.findAll({
        include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            following_key: userDeserialized.id,
        },
    });
    const followedUsers = yield Follow.findAll({
        include: {
            model: User,
            as: 'following',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            follower_key: userDeserialized.id,
        },
    });
    const userResponse = {
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
}));
/**
 * body {
 *      phrase: string
 * }
 */
userRouter.get('/search-users', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phrase = req.query.phrase.toString();
    try {
        const users = yield User.findAll({
            where: {
                [Op.or]: [
                    // find users by firstName
                    {
                        firstName: where(fn('LOWER', col('firstName')), 'LIKE', '%' + phrase.toLowerCase() + '%'),
                    },
                    // find users by lastName
                    {
                        lastName: where(fn('LOWER', col('lastName')), 'LIKE', '%' + phrase.toLowerCase() + '%'),
                    },
                    // find users by firstName + lastName
                    where(fn('LOWER', fn('concat', col('firstName'), col('lastName'))), 'LIKE', '%' + phrase.replaceAll(' ', '').toLowerCase() + '%'),
                ],
            },
            attributes: ['id', 'firstName', 'lastName'],
        });
        res.send({ users });
    }
    catch (e) {
        res.status(400).send({ error: e });
    }
}));
/**
 * body {
 *      userId: number
 * }
 */
userRouter.post('/follow-user', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = getUserFromRequest(req);
    const userId = user.userId;
    const userIdToFollow = req.body.userId;
    // nie mozna obserwowac samego siebie
    if (userId === userIdToFollow) {
        return res.sendStatus(400);
    }
    const follow = yield Follow.create({
        follower_key: userId,
        following_key: userIdToFollow,
    });
    return res.send({ follow });
}));
/**
 * body {
 *      userId: number
 * }
 */
userRouter.post('/unfollow-user', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = getUserFromRequest(req);
    const userId = user.userId;
    const userIdToUnFollow = req.body.userId;
    console.log("dupa");
    console.log(userId, userIdToUnFollow);
    const recordsDeleted = yield Follow.destroy({
        where: {
            follower_key: userId,
            following_key: userIdToUnFollow,
        },
    });
    if (!recordsDeleted) {
        return res.sendStatus(400);
    }
    return res.send({ status: 'git' });
}));
/**
 * body {
 *      userId: number
 * }
 */
userRouter.get('/user-profile/:userId', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const user = yield User.findOne({
        where: {
            id: userId,
        },
        attributes: ['id', 'firstName', 'lastName', 'biogram', 'birthdate', 'location', 'profilePicture'],
    });
    if (!user) {
        res.status(404).send('user not found');
    }
    const userPosts = yield Post.findAll({
        where: {
            UserId: userId,
        },
    });
    const followers = yield Follow.findAll({
        include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            following_key: userId,
        },
    });
    const followedUsers = yield Follow.findAll({
        include: {
            model: User,
            as: 'following',
            attributes: ['id', 'firstName', 'lastName'],
        },
        where: {
            follower_key: userId,
        },
    });
    res.send({ user: Object.assign(Object.assign({}, user.toJSON()), { followedUsers, followers }), userPosts });
}));
userRouter.get('/get-current-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.sendStatus(401);
    }
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    if (user) {
        console.log(user);
        const userData = yield User.findOne({ where: { id: user.userId } });
        const followers = yield Follow.findAll({
            include: {
                model: User,
                as: 'follower',
                attributes: ['id', 'firstName', 'lastName'],
            },
            where: {
                following_key: user.userId,
            },
        });
        const followedUsers = yield Follow.findAll({
            include: {
                model: User,
                as: 'following',
                attributes: ['id', 'firstName', 'lastName'],
            },
            where: {
                follower_key: user.userId,
            },
        });
        return res.send({ user: Object.assign(Object.assign({}, userData.toJSON()), { followedUsers, followers }), followedUsers, followers });
    }
    return res.sendStatus(404);
}));
userRouter.post('/comment-user', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentContent = req.body.content;
    const commentedUserId = req.body.commentedUserId;
    const user = getUserFromRequest(req);
    if (!commentContent || !commentedUserId) {
        return res.sendStatus(400);
    }
    const userComment = yield UserProfileComment.create({
        receiver_key: commentedUserId,
        content: commentContent,
        sender_key: user === null || user === void 0 ? void 0 : user.userId
    });
    res.send({ userComment });
}));
userRouter.get('/get-profile-comments/:userId', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const comments = yield UserProfileComment.findAll({
        include: {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName']
        },
        where: {
            receiver_key: userId,
        },
    });
    res.send({ comments });
}));
userRouter.patch('/change-data', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const birthDate = req.body.birthDate;
    const location = req.body.location;
    const biogram = req.body.biogram;
    const picture = req.body.picture;
    const userId = getUserFromRequest(req).userId;
    const userUpdate = yield User.update({
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
    });
    res.send({ userUpdate });
}));
function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '9999999s' });
}
export { userRouter };
