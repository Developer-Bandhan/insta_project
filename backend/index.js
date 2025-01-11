import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import userRoute from './routes/user_route.js'
import postRoute from './routes/post_route.js'
import messageRoute from './routes/message_route.js'
import storyRoute from './routes/story_route.js'
import {app, server} from './socket/socket.js';
import path from 'path';

dotenv.config({});


const PORT = process.env.PORT;

const __dirname = path.resolve();




//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}))

const corsOption = {
    origin: process.env.URL,
    credentials: true
}
app.use(cors(corsOption));



app.use('/api/v2/user', userRoute);
app.use('/api/v2/post', postRoute);
app.use('/api/v2/message', messageRoute);
app.use('/api/v2/story', storyRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend", "dist", "index.html"));
})



server.listen(PORT, () => {
    connectDB();
    console.log(`server listen at port ${PORT}`);
})