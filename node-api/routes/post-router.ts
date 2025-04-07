import { Router, Request, Response } from 'express'
import { ValidationError } from 'sequelize'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { authenticate } from '../middlewares/authMiddleware'
import { Post } from '../models/post'
import { getUserFromRequest } from '../utils/getUserFromRequest'
import { IUser } from '../types'
import { PostComment } from '../models/postComment'
import { log } from 'console'

const postRouter = Router()

postRouter.get(
    '/get-user-posts/:userId',
    authenticate,
    async (req: Request, res: Response) => { 
        const userId = Number(req.params.userId);
        const allPosts = await Post.findAll({
            where: {
                UserId: userId
            }
        });

        return res.send(allPosts);
    }
)

postRouter.get(
    '/get-likes/:postId',
    async (req: Request, res: Response) => {
        const postId = Number(req.params.postId);

        const likes = await Post.findOne({
            where: {
                id: postId
            }
        })
        return res.send(likes)
    }
)

postRouter.post(
    '/create',
    authenticate,
    async (req: Request, res: Response) => {
        const title = req.body.title
        const desc = req.body.desc
        const photo = req.body.photo
        const author = getUserFromRequest(req)
        

        const createdPost = await Post.create({
            title,
            desc,
            photo,
            UserId: (author as IUser).userId,
        })
        return res.send(createdPost)
    }
)

postRouter.post(
    '/delete-post',
    authenticate,
    async (req: Request, res: Response) => {
        const postId = Number(req.body.postId);

        const deletePost = await Post.destroy({
            where: {
                id: postId,
            },
        })

        res.send({deletePost})
    })

postRouter.post(
    '/add-comment',
    authenticate,
    async (req: Request, res: Response) => {
        const content = req.body.content;
        const postId = req.body.postId;
        const author = getUserFromRequest(req)
        
        const createdComment = await PostComment.create({
            content,
            UserId: (author as IUser).userId,
            PostId: postId
        })
        return res.send(createdComment)
    }
)

postRouter.patch(
    '/add-like',
    authenticate,
    async (req: Request, res: Response) => { 
        const postId = req.body.postId;
        const likesAmount = req.body.likesAmount;
        
        const postUpdate = await Post.update({
            likes: likesAmount ? Number(likesAmount) : 0
        }, {
            where: {
                id: postId,
            },
        })

        return res.send({ postUpdate })
    }
)

postRouter.post(
    '/get-comments-for-post',
    authenticate,
    async (req: Request, res: Response) => { 
        const postId = req.body.postId;
        const allComments = await PostComment.findAll({
            include: {model: User, attributes: ["firstName", "lastName", "id"]},
            where: {
                PostId: postId
            }
        });
        return res.send(allComments);
    }
)

postRouter.post(
    '/get-followed-users-posts',
    authenticate,
    async (req: Request, res: Response) => { 
        const followedUser = req.body.userId
        const allPosts = await Post.findAll({
            include: {model: User, attributes: ["firstName", "lastName", "id"]},
            where: {
                UserId: followedUser
            }
        });

        return res.send(allPosts);
    }
)

postRouter.get('/', authenticate, async (req: Request, res: Response) => {
    const allPosts = await Post.findAll({
        include: { model: User, attributes: ['firstName', 'lastName', 'id'] },
    })
    return res.send(allPosts)
})

export { postRouter }
