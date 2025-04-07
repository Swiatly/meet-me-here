import { Router } from "express";
const userRouter = Router();
userRouter.get('/', (req, res) => {
    res.json({
        "statusCode": 200,
        "statusMessage": 'dziala'
    });
});
export { userRouter };
