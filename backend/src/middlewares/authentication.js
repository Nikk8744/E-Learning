import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log(token)
        if(!token){
            return res.status(401).json({ msg: "Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            return res.status(401).json({ msg: "Invalid Access Token"})
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ msg: "Invalid Token, Try Again"})
    }
};

export const isTeacher = async(req, res, next) => {
    if(req.user && req.user.role === "Teacher"){
        next();
    }else{
        return res.status(401).json({ msg: "Unauthorized Access"})
    }

    // can use this also
    // if(!req.user && !req.user.role === "Teacher"){
    //     throw new ApiError(400, "Unauthorized access!!")
    // }
    // next();
}

export const isReviewer = (req, res, next) => {
    if (!req.user.isReviewer) {
        return res.status(403).json({ message: 'Access denied: Not a reviewer' });
    }
    next();
};
