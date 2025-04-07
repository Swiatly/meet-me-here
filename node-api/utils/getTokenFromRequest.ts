import { Request } from "express";

export const getTokenFromRequest = (req: Request) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return undefined;
    }

    return authHeader.split(" ")[1] 
}