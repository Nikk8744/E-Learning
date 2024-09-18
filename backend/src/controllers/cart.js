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
                courseAdded: courseId,
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
    const courseId = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: "No course Found!!" })
        }

        await User.findByIdAndUpdate(req.user?._id, {
            $pull: {
                courseAdded: courseId,
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

const getCart = async(req, res) => {
    try {
        const user = await User.findById(req.user?._id).populate('courseAdded');
        if (!user) {
            return res.status(400).json({msg: "No cart found for user"})
        }

        return res.status(200).json({
            msg: "Cart retrieved successfully",
            courseAdded: user.courseAdded,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error while retrieving cart" });
    }
}

export {
    addToCart,
    removeFromCart,
    getCart,
}