import { Schema, model } from "mongoose"

const DeliverySchema = new Schema({

    order:{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },

    deliveryType:{
        type:String,

        enum:[
            "pickup",
            "campus_delivery"
        ],

        default:"pickup"
    },

    meetupLocation:{
        type:String,
        required:true
    },

    deliveryInstructions:{
        type:String,
        default:''
    },

    deliveryPartner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    estimatedDeliveryTime:{
        type:Date
    },

    deliveredAt:{
        type:Date
    },

    status:{
        type:String,

        enum:[

            "pending",

            "accepted",

            "meetup_confirmed",

            "out_for_delivery",

            "delivered",

            "completed",

            "cancelled"

        ],

        default:"pending"
    }

},{
    timestamps:true
})

export const DeliveryModel = model("Delivery",DeliverySchema)