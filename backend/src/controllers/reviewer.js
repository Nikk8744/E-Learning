import { Course } from '../models/course.js';
import { User } from '../models/user.js'; 

const requestReviewerStatus = async (req, res) => {
    const userId = req.user._id; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isReviewer = true; 
        await user.save();

        res.status(200).json({
            message: 'You are now a reviewer.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isReviewer: user.isReviewer,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status', error });
    }
};

const reviewCourse = async(req, res) => {
    const {courseId} = req.params;
    const { isApproved } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ msg: "No Course foundd"})
    }

    const user = await User.findById(req.user?._id);
    if (!user || !user.isReviewer) {
        return res.status(400).json({ msg : "You are not a reviewer" })
    }

    course.isApproved = isApproved;
    await  course.save();

    return res.status(200).json({
        msg: "Course have  been approved by the reviewer()",
        course,
    })
}

const getCoursesThatNeedReview = async(req, res) => {}

export {
    requestReviewerStatus,
    reviewCourse,
    getCoursesThatNeedReview,
}