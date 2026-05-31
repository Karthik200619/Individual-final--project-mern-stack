import { Schema,model } from "mongoose"

const otpSchema = new Schema({

    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: ['REGISTER', 'RESET_PASSWORD'],
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        required: true
    }

})

export const OtpModel = model('Otps',otpSchema)