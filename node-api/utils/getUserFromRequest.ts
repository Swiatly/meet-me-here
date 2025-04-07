import jwt from 'jsonwebtoken'
import { Request } from 'express'
import { IUser } from '../types'

export const getUserFromRequest = (request: Request): IUser | undefined => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return undefined
    return jwt.decode(token) as IUser
}
