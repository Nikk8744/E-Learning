import { json } from "express";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";

const addToCart = async (req, res) => {
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ msg: "Course not found" })
        }
        await User.findByIdAndUpdate(req.user?._id, {
            $addToSet: {
                cart: courseId,
            }
        })

        return res.status(200).json({
            msg: "Course Added to cart successfully!!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server error occured while adding to cart!!" })
    }

}

const removeFromCart = async (req, res) => {
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: "No course Found!!" })
        }

        await User.findByIdAndUpdate(req.user?._id, {
            $pull: {
                cart: courseId,
            },
        })

        return res.status(200).json({
            msg: "Course removed successfully!!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server error while removing course from cart!" })
    }
}

const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).populate('cart');
        if (!user) {
            return res.status(400).json({msg: "No cart found for user"})
        }
        // console.log(user)
        return res.status(200).json({
            msg: "Cart retrieved successfully",
            cart: user.cart,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while retrieving cart" });
    }
}

const buyCourse = async(req, res) => {

    const { courseId } = req.params;

    const course = await Course.findById(courseId)
    if (!course) {
        return res.status(404).json({ msg: "Course not found!" });
    }

    const user = await User.findById(req.user?._id);
    if(user.enrolledCourses.includes(courseId)){
        return res.status(400).json({msg: "You have already  enrollrd in this course"})
    }

    user.cart = user.cart.filter((id) => id.toString() !== courseId.toString());        
    // Adding to user ke enrolledCOurse mai
    user.enrolledCourses.push(courseId);
    await user.save();


    return res.status(200).json({
        msg: "Course bought Successfully and course removed from cart and added to enrolledCourse!!!",
        enrolledCourses:  user.enrolledCourses,
    })
}

const buyAllCOursesFromCart = async(req, res) => {

    try {
        const user = await User.findById(req.user?._id).populate('cart');
        if (user.cart.length === 0) {
            return res.status(400).json({ msg: "Your cart is empty!!"})        
        }
    
        // phele sab course ko cart mai se filter krna 
        const coursesToEnroll = user.cart.filter((courseId) => 
            !user.enrolledCourses.includes(courseId.toString())
        );
        if(coursesToEnroll.length === 0){
            return res.status(400).json({msg: "You have already  enrolled in all the courses in your cart!!"}) 
        }
    
        // joo course  enroll krna hai unko enrolledCourses mai add krna
        user.enrolledCourses.push(...coursesToEnroll);
    
        user.cart = []
        await user.save();
    
        return res.status(200).json({
            msg: "All courses in cart have been successfully added to enrolled courses!!",
            enrolledCourses: user.enrolledCourses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Server Error while add all course from cart to enrolled courses"})
    }
}

export {
    addToCart,
    removeFromCart,
    getCart,
    buyCourse,
    buyAllCOursesFromCart
}