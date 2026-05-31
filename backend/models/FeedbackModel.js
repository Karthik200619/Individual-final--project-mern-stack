import { Schema, model } from "mongoose";

const FeedbackSchema = new Schema({
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
    }
}, {
    timestamps: true
});

export const FeedbackModel = model("Feedback", FeedbackSchema);
