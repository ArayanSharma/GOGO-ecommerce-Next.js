import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line1: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
       
    },
    country: {
        type: String,   
    },
    mobile: {
        type: Number,
        default: null
    },
    addressType: {
        type: String,
        enum: ["Home", "Office"],

    },
    userId: {
        type: String,
        default:""
    }
}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema);