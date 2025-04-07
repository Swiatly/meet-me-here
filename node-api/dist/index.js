import express from 'express';
import { db } from './db';
import { userRouter } from './routes/user-router';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { postRouter } from './routes/post-router';
import cors from 'cors';
const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:4200', '*'],
    },
});
// get config vars
dotenv.config();
// access config var
console.log(process.env.TOKEN_SECRET);
app.use(cors());
app.use(express.json());
app.use('/*', (req, res, next) => {
    console.log(req.url);
    next();
});
app.use('/user', userRouter);
app.use('/post', postRouter);
app.get('/getData', (req, res) => {
    res.json({
        statusCode: 200,
        statusMessage: 'dziala',
    });
});
server.listen(PORT, () => {
    console.log(`Express API is running at port ${PORT}`);
});
db.authenticate()
    .then(() => {
    db.sync({ force: true });
    console.log('Connection has been established successfully.');
})
    .catch((e) => {
    console.log('No connection with database. Error:' + e);
});
