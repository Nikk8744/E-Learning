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
        material: {
            type: Schema.Types.ObjectId,
            ref: "Material",
        },
        reviews: {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        }
        
    },{
    timestamps: true,
});

export const Course = mongoose.model("Course", courseSchema);