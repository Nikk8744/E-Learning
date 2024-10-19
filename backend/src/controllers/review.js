import { Course } from "../models/course.js";
import { Review } from "../models/review.js";

const giveReview = async(req, res) => {
    const { courseId } = req.params;
    const {rating, comment } = req.body;

    // try {
        const course = await Course.findById(courseId).populate("enrolledStudents");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        const isEnrolled = course.enrolledStudents.some( student => student._id.equals(req.user?._id));
        if (!isEnrolled) {
            return res.status(403).json({ message: "You are not enrolled in this course"});
        }
    
        const existingReview = await  Review.findOne({courseId, userId: req.user?._id});
        if (existingReview) {
            return  res.status(400).json({ message: "You have already given a review for this course"})
        }
    
        const review = await Review.create({
            course:  courseId,
            user: req.user?._id,
            rating,
            comment,
        })
    
        if (!review) {
            return res.status(404).json({ msg:  "Review not created" });
        }
        course.reviews.push(review._id);
        await course.save();
    
        return res.status(200).json({
            msg: "Review Created Successfully", 
            review
        })
    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).json({msg:  "Internal Server Error while creating review"})
    // }
}

const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch all reviews for the course
        const reviews = await Review.find({ course: courseId }).populate('user', 'username');

        // Get total number of reviews
        const totalReviews = reviews.length;

        res.status(200).json({ reviews, totalReviews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export {
    giveReview,
    getCourseReviews
}