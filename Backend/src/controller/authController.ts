import express, { Request, Response, RequestHandler } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}


export const register = async(req: Request, res: Response) => {
    console.log("Registering user:", req.body);
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log('User already exists:', email); // Add this log
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({email, password:hashedPassword});
        res.status(201).json({message:"User registered successfully"});
    } catch(err){
        console.error('Registration error:', err);
        res.status(500).json({message:"Error registering User"})
    }
}

export const login = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"User not found"});
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid) return res.status(400).json({message:"Invalid password"});

        //Generating jwt token
        const token = jwt.sign(
            {userId:user._id}, 
            JWT_SECRET, 
            {expiresIn:"1h"}
        );

        if (!user.tokens) {
            user.tokens = [];
        }
        console.log('Token generated:', token);
        //Saving token in database
        user.tokens.push(token);
        await user.save();

        //Setting the cookie
        res.cookie('token',token, {httpOnly:true, secure:false,
            sameSite: 'lax'});
        res.json({
            success: true,
            token: token,
            user: {
                userId: user._id,
                email: user.email
            }
        });
    }
    catch(err) {
         console.error("Login error:", err); // Add this for debugging
        res.status(500).json({message:"Error Loggin in"})
    }
}

export const logout = async(req: Request, res: Response) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:"no token provided"});
    try{
        const user = await User.findOne({tokens:token});
        if(!user) return res.status(401).json({message:"User not found"});

        //Remove token from database

        user.tokens = user.tokens.filter((t)=> t!== token);
        await user.save();

        //Clear the cookie

        res.clearCookie('token');
        res.json({message:"Logged out successfully"});

    } catch(err) {
        res.status(500).json({message:"Error Loggin out"})
    }
}
