import { Schema, model } from "mongoose";

const CartItemSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1
    }

}, { _id: false });

const UserSchema = new Schema({

    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },

    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 30
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 100,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email"
        ]
    },
    campus: {
        type: Schema.Types.ObjectId,
        ref: 'Campus',
        required: true
    },

    phoneNo: {
        type: Number,
        required: true,
        unique: true,

    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        required: true

    },

    profileImageUrl: {
        type: String,
        default: "",
        maxlength: 500
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
            "Password must contain uppercase, lowercase, number and special character"
        ]
    },

    cartItems: [CartItemSchema],
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHERS'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    strict: true
});

export const UserModel = model("User", UserSchema);