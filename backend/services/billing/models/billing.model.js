import {mongoose} from"mongoose"

const billingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },    
    amount:{
        type:Number,
        required:true
    },
    interviewCoins:{
        type:Number,
        required:true
    },
    balanceAfter: Number,
    razorpayOrderId:String,
    razorpayPaymentId:String,
    razorpaySignature:String,

    planId: String,
    status:{
        type:String,
        enum:["created","failed","paid"],
        default:"created"
    }


},{timestamps:true})


export const Billing = mongoose.model("Billing",billingSchema)
