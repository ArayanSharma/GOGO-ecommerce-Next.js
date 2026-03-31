import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            productId: {
                type: String,
            },
            productId: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
            image: {
                type: String,
            },
            subTotal: {
                type: Number,
            },
        },
    ],
    paymentId: {
        type: String,
        default: "",
    },
    payment_status : {
        type: String,
        default:""

    }
    order_status: {
        type: String,
        default:"confirm"
    },
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    },
    totalAmt: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const Order = mongoose.model("Order", addressSchema);
