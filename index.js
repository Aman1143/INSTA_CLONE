import express from 'express'
const app = express();
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/AuthRoute.js'
import PostRoute from './routes/PostRoute.js'
import path from "path";




app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())


app.use('/api/user', AuthRoute);
app.use('/api/post', PostRoute);

dotenv.config();
const PORT = process.env.PORT;

(async () => {
	await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log("connected");
})()

app.use('/static', express.static('client/build/static'))
app.get('/', (req, res) => {
	res.sendFile(path.resolve(path.resolve() + '/client/build/index.html'))
})

app.listen(PORT, () => {
	console.log("runing");
})
