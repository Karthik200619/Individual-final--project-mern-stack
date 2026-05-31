import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    type: {
        type: String,
        enum: ['admin', 'system', 'query', 'stock'],
        default: 'system'
    },
    relatedOrder: {
        type: Schema.Types.ObjectId,
        ref: 'Orders'
    },
    relatedItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    relatedQuery: {
        type: Schema.Types.ObjectId,
        ref: 'HelpQuery'
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const NotificationModel = model('Notification', NotificationSchema)
