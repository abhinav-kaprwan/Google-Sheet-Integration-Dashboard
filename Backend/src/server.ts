
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import auth from "./routes/authRoute";
import tableRoutes from "./routes/tableRoutes";



const app = express();
app.use(cors({
    origin:'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",auth);
app.use("/api/tables",tableRoutes)
//Connecting to mongodb

mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log("Connected to Mongo Db");
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
    }).catch((err)=> console.log("Mongo db error ", err))

export default app;