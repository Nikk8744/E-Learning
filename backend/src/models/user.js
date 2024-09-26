import mongoose, { Schema } from "mongoose"
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
            maxlength: 64,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email"],
            unique: true
        },
        role: {
            type: String,
            default: "Student",
            enum: ["Student", "Teacher", "Reviewer"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minlength: [6, 'password must have at least (6) characters'],
        },
        refreshToken: {
            type: String,
        },
        cart: [{
            type: Schema.Types.ObjectId,
            ref: "Course",
        }],
        teacherDetails: { 
            type: Schema.Types.ObjectId,
            ref: "TeacherDetails"
        },
    },
    {
    timestamps: true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJwtAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateJwtRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const teacherDetailsSchema = new Schema(
    {
        experience: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        highestQualification: {
            type: String,
            required: true,
        },
        

    },
    { timestamps: true}
)

const User = mongoose.model("User", userSchema);

const TeacherDetails = mongoose.model("TeacherDetails",  teacherDetailsSchema);

export {
    User,
    TeacherDetails,
}
