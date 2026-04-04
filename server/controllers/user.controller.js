import UserModel from "../models/user.model.js";   
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/verifyEmailTemplate.js";

// Get all users
export const registerUserController = async (req, res) => {
    try {
        let user;

        const { name, email, password } = req.body;
        console.log(name, email, password);

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
            email,
            "Email Verification - GOGO",
            verificationEmail(name, verifyEmail)
        );

        const token = jwt.sign(
            {email: user.email, id: user._id}, 
            
             process.env.JWT_SECRET, 
             );

             return res.status(200).json({
                message: "User registered successfully. Please verify your email.",
                success: false,
                error: false,
                token
            });

    } catch (error) {
         return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
                
            });
    }
};

export const verifyEmailController = async (req, res) => {

    try {
        const { email, otp } = req.body;
        
        console.log(email, otp);
        
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ 
                message: "User not found",
                error: true,
                success: false
             });
        }   
        
        const isCodeValid = user.otp === otp ;
        const isNotExpired = user.otp_expiry > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_Email = true;
            user.otp = null;
            user.otp_expiry = null;
            await user.save();

            return res.status(200).json({
                message: "Email verified successfully",
                success: true,
                error: false
            });

        }
        else if (!isCodeValid) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
                error: true
            });
        } else {
            return res.status(400).json({
                message: "OTP expired",
                success: false,
                error: true
            });
        }   

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
        });
    }
};

export const resendOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.verify_Email) {
            return res.status(400).json({
                message: "Email already verified",
                error: true,
                success: false
            });
        }

        // Generate new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Update user with new OTP and expiry
        user.otp = newOtp;
        user.otp_expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        // Send email
        await sendEmailFun(
            email,
            "Email Verification - GOGO (Resend)",
            verificationEmail(user.name, newOtp)
        );

        return res.status(200).json({
            message: "OTP sent successfully",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Error"
        });
    }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ 
                message: "User not registered",
                error: true,
                success: false
             });
        }

        if(user.status != "active") {
            return res.status(400).json({
                message: "User is not active. Please contact support.",
                error: true,
                success: false
            });
        }

        if (!user.verify_Email) {
            return res.status(400).json({
                message: "Email not verified. Please verify your email.",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        const accessToken = generateAccessToken(user?._id);
        const refreshToken = generateRefreshToken(user?._id);
        const updateUser = await UserModel.findByIdAndUpdate(user._id,{last_login_date: Date.now()},{returnDocument: 'after'});
       const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None", 
        };
        res.cookie("accessToken", accessToken, cookiesOptions);
        res.cookie("refreshToken", refreshToken, cookiesOptions);

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            error: false,
            date:{
            accessToken,
            refreshToken
            }
        });
         
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: true,
                message: error.message || Error,
            });
        }
};

export const logoutsController = async (req, res) => {
    try {
        const userId = req.userId;

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        res.clearCookie("accessToken", cookiesOptions);
        res.clearCookie("refreshToken", cookiesOptions);

        const remoRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refreshToken:"" });

            return res.status(200).json({
                message: "User logged out successfully",
                success: true,
                error: false,
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
        });
    }
};

export const forgotPasswordController = async (req, res) => {
    try{

        const {email} = req.body;
        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        else{
            const verifyEmail = Math.floor(100000 + Math.random() * 900000).toString();

            user.otp = verifyEmail;
            user.otpExpires= Date.now() + 10 * 60 * 1000;

                await user.save();

                await sendEmailFun(
                    email,
                    "Password Reset - GOGO",
                    verificationEmail(user.name, verifyEmail)
                );
                return res.status(200).json({
                    message: "Password reset OTP sent to email",
                    success: true,
                    error: false
                });

        }

    }  catch(error){
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
        });
    }


};

export const verifyForgetPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if(!email || !otp){
            return res.status(400).json({
                message: "Please provide email and OTP",
                error: true,
                success: false
            });
        }

        if(user.otp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({
                message: "Invalid or expired OTP",
                error: true,
                success: false
            });

            const currentTime = Date.now();
            if (user.otpExpires < currentTime) {

                return res.status(400).json({
                    message: "OTP has expired",
                    error: true,
                    success: false
                });
            }
            user.otp = "";
            user.otpExpires = "";
            await user.save();

            return res.status(200).json({
                message: "OTP verified successfully",
                success: true,
                error: false
            });

        }




    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
        });
    }
};

//change password

 export const changePasswordController = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message: "Please provide email, new password and confirm password",
                error: true,    
                success: false
            });
        } 
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message: "New password and confirm password do not match",
                error: true,
                success: false
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.signUpWithGoogle = false;
        await user.save();
        return res.status(200).json({
            message: "Password changed successfully",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || Error,
        });
    }
};

export async function authWithGoogle(req, res) {
    const { name, email, password, avatar, mobile, role } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        if (!existingUser) {
            const user = new UserModel({
                name,
                email,
                password,
                avatar,
                mobile,           // ✅ was: moblie
                role,
                verify_Email: true,
                signUpWithGoogle: true,
                singUPwithGoogle: true,
            });
            await user.save();

            const accessToken = await generateAccessToken(user._id);
            const refreshToken = await generateRefreshToken(user._id);

            await UserModel.findByIdAndUpdate(user._id, { last_login_date: Date.now() });

            res.cookie("accessToken", accessToken, cookieOptions);
            res.cookie("refreshToken", refreshToken, cookieOptions);

            return res.status(201).json({  // ✅ 201 for resource creation
                message: "User authenticated with Google successfully",
                success: true,
                error: false,
                data: {
                    accessToken,
                    refreshToken,
                    userEmail: user.email,
                    userName: user.name,
                }
            });

        } else {
            const accessToken = await generateAccessToken(existingUser._id);
            const refreshToken = await generateRefreshToken(existingUser._id);

            await UserModel.findByIdAndUpdate(existingUser._id, { last_login_date: Date.now() });

            res.cookie("accessToken", accessToken, cookieOptions);
            res.cookie("refreshToken", refreshToken, cookieOptions);

            return res.status(200).json({   // ✅ was: missing response entirely
                message: "User authenticated with Google successfully",
                success: true,
                error: false,
                data: {
                    accessToken,
                    refreshToken,
                    userEmail: existingUser.email,
                    userName: existingUser.name,
                }
            });
        }

    } catch (error) {   // ✅ was: catch nested inside try, outside closing brace
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || "An error occurred during Google authentication"
        });
    }
}