import UserModel from "../models/user.model.js";   
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

// Get all users
export const registerUserController = async (req, res) => {
    try {
        let user;

        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ 
                message: "Please fill all the fields" ,
                error :true,
                success : false

            });
        }

        // Check if user already exists
        user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const verifyEmail = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp: verifyEmail,
            otp_expiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
            });
        await user.save();

        await sendEmailFun(
            {
                sendTo: email,
                subject: "Email Verification - GOGO ",
                text:"",
                html: verificationEmail(name, verifyEmail)
            }
        )

        const token = jwt.sign(
            {email: user.email, id: user._id}, 
            
             process.env.JSON_WEB_TOKEN_SECRET_KEY, 
             );

             return res.status(200).json({
                message: "User registered successfully. Please verify your email.",
                success: false,
                error: false,
                token
            });

    } catch (error) {
         return res.status(200).json({
            success: false,
            error: true,
            message: error.message || Error,
                
            });
    }
};




