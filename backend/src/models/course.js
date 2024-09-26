import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
        },
        description: {
            type: String,
            required: [true, "Description is required!"],
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Teacher is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"]
        },
        category: {
            type: String,
            required: true
        },
        material: {
            type: Schema.Types.ObjectId,
            ref: "Material",
        },
        isApproved:{
            type: Boolean,
            default: false,
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }],
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
        },
        duration: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        }
        
    },{
    timestamps: true,
});

export const Course = mongoose.model("Course", courseSchema);