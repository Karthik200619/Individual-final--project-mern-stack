import { Schema, model } from "mongoose"

const CampusSchema = new Schema({

    campusName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    campusLogo: {
        type: String,
        default: ''
    },

    campusEmailDomain: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    city: {
        type: String,
        required: true
    },

    isApproved: {
        type: Boolean,
        default: false
    },
    preferredDeliveryLocations: [

        {
            locationName: {
                type: String,
                required: true
            },

            categorySupport: [

                {
                    type: String,

                    enum: [

                        "BOOKS",

                        "ELECTRONICS",

                        "FASHION",

                        "FURNITURE",

                        "SPORTS",

                        "STATIONERY",

                        "OTHERS"

                    ]

                }

            ]

        }

    ]

}, {
    timestamps: true
})

export const CampusModel = model(
    'Campus',
    CampusSchema
)