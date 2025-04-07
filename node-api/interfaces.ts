import { IUser } from './types'

export type UserAttributes = {
    userId: number
    firstName?: string
    lastName?: string
}

export type UserResponse = {
    firstName: string
    lastName: string
    userId: number
    biogram: string
    birthDate: Date
    location: string
    picture: string
    followers: IUser[]
    following: IUser[]
}
