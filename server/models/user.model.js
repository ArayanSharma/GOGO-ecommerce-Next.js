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
        required: function requiredPassword() {
            return !this.signUpWithGoogle;
        },
    },
     avatar: {
        type: String,
       default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
    },

    mobile: {
        type: Number,
        default: null
    },
    verify_Email: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        default: ""
    },
    last_login_date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    },

    address_details: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        }
    ],
    ordersHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order",
        }
    ],
    otp: {
        type: String  
    },
    otp_expiry: {
        type: Date
    },  
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    signUpWithGoogle: {
        type: Boolean,
        default: false
    },
    // Backward-compatibility for existing records using the old typo.
    singUPwithGoogle: {
        type: Boolean,
        default: false,
        select: false,
    }
 }, { timestamps: true });
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
