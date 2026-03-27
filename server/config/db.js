import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


//mono connect nhi h to error

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables");
}

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI) 
           console.log("MongoDB connected successfully");
            
        
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;