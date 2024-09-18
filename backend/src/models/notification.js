import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
        },
        message: {
            type: String,
            required: [true, "Message is required!"],
        },
        toWhom: {
            type: String,
            enum: ["all", "specific"],
            default: "all",
            required: true,
        },
        students: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
    },
    {
        timestamps: true,
    }
)

export const Notification = mongoose.model("Notification", notificationSchema)