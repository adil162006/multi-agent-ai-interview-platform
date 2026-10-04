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
            type:String,
            default:150,
            
        }

    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);