import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import AuthRouter from './Router/AuthRoute.js'
import userRoute from './Router/userRoute.js'
import postRoute from './Router/PostRoute.js';
import cors from 'cors';
import connection from './Database/dbConnection.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';



dotenv.config()

const port = process.env.PORT || 5000 
connection(); 
const app = express() 
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(helmet());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


cloudinary.v2.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});
  app.use('/api',AuthRouter);
  app.use('/api',userRoute);
  app.use('/api',postRoute);
app.listen (port , ()=> 
    console.log(`server is running on ${port}`));

