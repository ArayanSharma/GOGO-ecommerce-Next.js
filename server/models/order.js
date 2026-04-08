import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        subTotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderAddressSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: 'Home',
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
        },
        nearBy: {
            type: String,
            default: '',
            trim: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            default: [],
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: 'Order must contain at least one item',
            },
        },
        deliveryAddress: {
            type: orderAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            default: 'COD',
        },
        paymentId: {
            type: String,
            default: '',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        shipping: {
            type: Number,
            default: 0,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
