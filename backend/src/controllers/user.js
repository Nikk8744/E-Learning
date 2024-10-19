import { TeacherDetails, User } from "../models/user.js";

const registerUser = async(req, res) => {
    const {username, email, password, role, teacherDetails} = req.body;

    if(
        [username, email, password, role].some((field) => field?.trim() === "")
    ){
        return res.status(400).json({ msg: "All fields are required" });
    }

   try {
     const existedUser = await User.findOne({email});
     if(existedUser){
         return res.status(400).json({ msg: "USer already exists" });
     }
 
     const newUser = await User.create({
         username,
         email,
         password,
         role,
     });

     if (role === "Teacher") {
        const details = new TeacherDetails(teacherDetails);
        await details.save();
        newUser.teacherDetails = details._id;
    }

    await newUser.save();
 
     const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
 
     if(!createdUser){
         return res.status(400).json({ msg: "SOmething went wrong while registering!!"})
     }

 
     return res.status(201)
     .json({
         msg: "User created Successfully",
         createdUser,
     })
   } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Some server error occured while registering!!"})
   }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body;
    
    if(!email && !password){
        return res.status(401).json({ msg: "All fields are required"})
    }

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ msg: "No such user found!!"})
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Passowrd not Valid"})
        }
    
        const accessToken = user.generateJwtAccessToken();
        const refreshToken = user.generateJwtRefreshToken();

        const loggedInUser = await User.findById(user._id).select("-refreshToken -password");
        const options = {
            httpOnly: true,
            secure: false,
        };

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            msg: "User loggedIn Successfuly",
            loggedInUser,
            accessToken,
            refreshToken
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: "Server has some error, Try Again"})
    }
}

const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        msg: "User logged out Successfully!!",
    })
}

const getUserProfile = async(req, res) => {
  try {
      const user = await User.findById(req.user._id).select("-password");
      if(!user){
          return res.status(401).json({ msg: "User not found" })
      }
  
      res.status(201).json({
          msg: "Details Fetched Successfully",
          user
      })
  } catch (error) {
    res.status(500).json({msg: "Server error, cant get your profile right now"})
  }
}

const updateUserDetails = async(req, res) => {
    const {username, email} = req.body;
    if(!username && !email){
        return res.status(400).json({ msg: "Enter details to change/Update" });
    }
    
    try {
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName,
                    email: email
                }
            },
            {
                new: true
            }
        ).select("-password")
    
        if(!user){
            return res.status(401).json({ msg: "Something went wrong while updating."})
        }
    
        return res.status(200).json({
            msg: "Details Updated Successfully",
            user
        })
    } catch (error) {
        return res.status(501).json({ msg: "Server Error, while Updating!!"})
    }
}

const changePassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;

    try {
        const user = await User.findById(req.user?._id)
    
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordCorrect){
            return res.status(401).json({ msg: "Old Password is Incorrect"})
        }
    
        user.password = newPassword;
        await user.save({ validateBeforeSave: false})
    
        return res.status(200).json({
            msg: "Password Changed Successfully",
        })
    } catch (error) {
        return res.status(501).json({ msg: "Server Error, while changing password"})
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserDetails,
    changePassword,
}