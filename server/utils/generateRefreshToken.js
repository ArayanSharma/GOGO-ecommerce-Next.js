import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model";
import generateAccessToken from './generateAccesToken';

export const generateRefreshToken = async (userID) => {
   const token = await jwt.sign(
    { id: userID }, 
    process.env.SECRET_KEY_REFRESH_TOKEN,
     { expiresIn: '7d' });
   
   const updateRefreshTokenUser = await UserModel.updateOne(
    { _id: userID },
    { $set: { refreshToken: token } },
    { new: true }
   );
   return token;       

};
export default generateRefreshToken;