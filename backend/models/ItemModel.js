    import { Schema, model } from "mongoose";

    const CommentSchema = new Schema({

        commentBody: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 500
        },

        commentedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    }, {
        timestamps: true
    });

    const ItemSchema = new Schema({

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: [
                "BOOKS",
                "ELECTRONICS",
                "FASHION",
                "FURNITURE",
                "SPORTS",
                "STATIONERY",
                "OTHERS"
            ]
        },

        // Image shown in cards/search/home page
        coverImage: String,

        images: [String],

        videos: [String],

        

        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Admin approval
        isActive: {
            type: Boolean,
            default: false
        },

        approvedAt: {
            type: Date,
            default: null
        },

        rating: {
            type: Number,
            default: 5,
            min: 1,
            max: 5
        },

        comments: [CommentSchema]

    }, {
        timestamps: true,
        strict: true
    });

    export const ItemModel = model("Item", ItemSchema);