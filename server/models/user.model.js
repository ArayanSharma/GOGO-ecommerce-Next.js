import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[ true,"Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
     password: {
        type: String,
        required: [true, "Password is required"],
    },

    phone: {
        type: String,
        required: [true, "Phone number is required"]
    }
}, { timestamps: true });
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
