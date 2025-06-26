import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        },
    ],
    totalAmount: Number,
    shippingAddress: {
        name: String,
        mobileNo: String,
        houseNo: String,
        street: String,
        landMark: String,
        city: String,
        country: String,
        postalCode: String,
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
        default: 'Cash on Delivery',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);