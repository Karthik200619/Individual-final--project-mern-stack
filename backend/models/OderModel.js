import { Schema, model } from "mongoose"

const OrderSchema = new Schema({

    buyer:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    seller:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    item:{
        type:Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },

    delivery:{
        type:Schema.Types.ObjectId,
        ref:'Delivery'
    },

    quantity:{
        type:Number,
        required:true,
        min:1
    },

    totalPrice:{
        type:Number,
        required:true
    },

    discountCode:{
        type:String,
        default:""
    },

    discountAmount:{
        type:Number,
        default:0
    },


    paymentMethod:{
        type:String,

        enum:[
            "cash",
            "upi"
        ],

        default:"cash"
    },

    status:{
        type:String,

        enum:[

            "pending",

            "accepted",

            "completed",

            "cancelled",

            "rejected"

        ],

        default:"pending"
    }

},{
    timestamps:true
})

export const OrderModel = model('Orders',OrderSchema)