import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        interviewCoin:{
            type:Number,
            default:150,
        },
        creditedPaymentIds: {
            type: [String],
            default: [],
        },

    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);