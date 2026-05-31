import { Schema, model } from "mongoose";

const HelpQuerySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    status: {
        type: String,
        enum: ['Pending', 'Viewed', 'Working on query', 'Resolved'],
        default: 'Pending'
    },
    adminResponse: {
        type: String,
        default: ""
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Orders"
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

export const HelpQueryModel = model("HelpQuery", HelpQuerySchema);
