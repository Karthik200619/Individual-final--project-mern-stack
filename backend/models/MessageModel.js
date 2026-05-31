import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item"
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const MessageModel = model("Message", MessageSchema);
