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
import { User } from '../models/user';
import { authenticate } from '../middlewares/authMiddleware';
import { Post } from '../models/post';
import { getUserFromRequest } from '../utils/getUserFromRequest';
import { PostComment } from '../models/postComment';
const postRouter = Router();
postRouter.get('/get-user-posts/:userId', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const allPosts = yield Post.findAll({
        where: {
            UserId: userId
        }
    });
    return res.send(allPosts);
}));
postRouter.get('/get-likes/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postId);
    const likes = yield Post.findOne({
        where: {
            id: postId
        }
    });
    return res.send(likes);
}));
postRouter.post('/create', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const author = getUserFromRequest(req);
    const createdPost = yield Post.create({
        title,
        desc,
        photo,
        UserId: author.userId,
    });
    return res.send(createdPost);
}));
postRouter.post('/delete-post', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.body.postId);
    const deletePost = yield Post.destroy({
        where: {
            id: postId,
        },
    });
    res.send({ deletePost });
}));
postRouter.post('/add-comment', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body.content;
    const postId = req.body.postId;
    const author = getUserFromRequest(req);
    const createdComment = yield PostComment.create({
        content,
        UserId: author.userId,
        PostId: postId
    });
    return res.send(createdComment);
}));
postRouter.patch('/add-like', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const likesAmount = req.body.likesAmount;
    const postUpdate = yield Post.update({
        likes: likesAmount ? Number(likesAmount) : 0
    }, {
        where: {
            id: postId,
        },
    });
    return res.send({ postUpdate });
}));
postRouter.post('/get-comments-for-post', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const allComments = yield PostComment.findAll({
        include: { model: User, attributes: ["firstName", "lastName", "id"] },
        where: {
            PostId: postId
        }
    });
    return res.send(allComments);
}));
postRouter.post('/get-followed-users-posts', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followedUser = req.body.userId;
    const allPosts = yield Post.findAll({
        include: { model: User, attributes: ["firstName", "lastName", "id"] },
        where: {
            UserId: followedUser
        }
    });
    return res.send(allPosts);
}));
postRouter.get('/', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield Post.findAll({
        include: { model: User, attributes: ['firstName', 'lastName', 'id'] },
    });
    return res.send(allPosts);
}));
export { postRouter };
