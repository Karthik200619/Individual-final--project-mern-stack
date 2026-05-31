import { Schema, model } from "mongoose";

const DiscountSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date
    },
    category: {
        type: String,
        enum: ["ALL", "BOOKS", "ELECTRONICS", "FASHION", "FURNITURE", "SPORTS", "STATIONERY", "OTHERS"],
        default: "ALL"
    },
    minPrice: {
        type: Number,
        default: 0
    },
    maxPrice: {
        type: Number,
        default: null
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export const DiscountModel = model("Discount", DiscountSchema);
