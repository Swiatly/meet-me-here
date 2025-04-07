export const getTokenFromRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return undefined;
    }
    return authHeader.split(" ")[1];
};
