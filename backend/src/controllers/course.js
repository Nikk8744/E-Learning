import { isValidObjectId } from "mongoose";
import { Course } from "../models/course.js";
import { User } from "../models/user.js";

const createCourse = async(req, res) => {
    const {title, description, price, material, level, category, duration, rating} = req.body;
    const teacherId = req.user?._id;

    if(
        [title, description, price, level, category, duration, rating].some((field) => {
            if (typeof field === 'Number' || typeof field !== 'String') {
                field = field.toString();
            }
            return field.trim() === "";
        })
    ){
        return res.status(400).json({ msg: "All fields are required"})
    }
    

    try {
        const teacher = await User.findById(teacherId);
        if(teacher.role !== "Teacher"){
            return res.status(403).json({ msg: "Only teachers can create a course"})
        }
    
        const course = await Course.create({
            title,
            description,
            price,
            category,
            level,
            material,
            duration,
            rating,
            teacher: teacherId,
        })
        if(!course){
            return res.status(400).json({ msg: "Course not created, somethig went wrong"})
        }
    
        return res.status(200).json({
            msg: "Course created Successfully",
            course,
        })
    } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Some server error occured while creating Course !!"})
    }


};

const getAllCourse = async(req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'username email')
        // .populate('reviews');
        // console.log(courses)
        if (!courses) {
            return res.status(401).json({msg: "No courses found"})
        }

        return res.status(200).json({
            msg: "Courses retrived successfully",
            courses,
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error while retriving courses'});
    }
}

const getCourseById = async(req, res) => {
    const {courseId} = req.params; 
    if(!isValidObjectId(courseId)){
        return res.status(401).json({msg: "Enter Valid CourseId"})
    }

    try {
        const course = await Course.findById(courseId).populate('teacher', 'username email')
        // .populate('reviews');
        if(!course){
            return res.status(400).json({msg: "No such course found"})
        }
    
        return res.status(200).json({
            msg: "Course Fetched Successully",
            course,
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Server error while fetching course",
        })
    }
}

const updateCourse = async(req, res) => {
    const { courseId } = req.params;
    const {title, description, price} = req.body;

    if (!title && !description && !teacher && !price) {
        return res.status(400).json({ msg: "Enter some details to change/update"})
     }

    try {
         const course = await Course.findById(req.user?._id);
         if(course?.teacher.toString() !== req.user?._id.toString()){
            return res.status(400).json({ msg: "You are not authorized!! Only owner of this course can change details!!"})
         }
         
         const updateCourse = await Course.findByIdAndUpdate(courseId,
            {
                $set: {
                    title,
                    description,
                    price,
                }
            },
            { new: true }
         )
    
         if(!updateCourse){
            return res.status(401).json({ msg: "Something went wrong while updating course details"})
         }
    
         return res.status(200).json({
            updateCourse,
            msg: "Details Updated Successfully!!"
         })
    } catch (error) {
        return res.status(500).json({ msg: "Server error while updating course details!!"})
    }
}

const deleteCourse = async(req, res) => {
    const { courseId } = req.params;
    if(!isValidObjectId(courseId)){
        return res.status(400).json({msg: "Invalid Id"})
    }

    try {
        const deleteCourse = await Course.findByIdAndDelete(courseId);
        if (!deleteCourse) {
            return res.status(400).json({ msg: "Something went wrong while deleting course!"})
        }
    
        return res.status(200).json({
            deleteCourse,
            msg: "Course deleted Successfully!!"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Server Error, while deleting course!!"
        })
    }
}

const getNewCourses = async(req, res) => {
    try {
        const course = await Course.find().populate("teacher", "username email").sort({ createdAt: -1 });
        if(!course){
            return res.status(404).json({ msg: "No courses found!!" })
        }
    
        return res.status(200).json({
            msg:  "Courses fetched Successfully!!",
            course
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server error while retriving courses"})
    }
}

const getTopRatedCourse = async(req, res) => {
    try {
            const topRatedCourse = await Course.find({
                rating: {
                    $gte: 4
                }
            }).populate("teacher", "username email")
            .sort({ rating: -1});
        
            if(!topRatedCourse){
                return res.status(404).json({ msg: "top rated Courses not found!!!"})
            }
        
            return res.status(200).json({
                msg: "Top Rated COurses fetched successfully!!",
                topRatedCourse
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server Error! while retriving top rated courses"})
    }
}

const getAllCoursesOfTeacher = async (req, res) => {
    const teacherId = req.user?._id;

    try {
            const courses  = await Course.find({ teacher: teacherId }).populate("teacher", "username email");
        
            if(!courses){
                return res.status(404).json({
                    msg: "No courses found for the Teacher!!"
                })
            }
        
            return res.status(200).json({
                msg: "All Courses fetched successfully!!",
                courses,
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server Error! while retriving all courses created by Teacher" })
    }

}

const getAllEnrolledCourses = async (req, res) => {
    const studentId = req.user?._id;

    try {
            const enrolledCOurses = await Course.findById(studentId).populate("enrolledCourses");
            if(!enrolledCOurses){
                return res.status(404).json({
                    msg:  "No courses found for the Student!!"
                })
            }
            
            return res.status(200).json({
                msg:  "All Enrolled Courses fetched successfully!!",
                enrolledCOurses,
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Server error while retriving enrolled courses"})
    }
}

const enrollInCourse = async (req, res) => {
    const studentId = req.user?._id;
    const { courseId }  = req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ msg: "Course not found !!" })
    
        }
    
        await User.findByIdAndUpdate(
            studentId,
            {
                $addToSet: {
                    enrolledCourses: courseId
                }
            },
            { new: true }
        )
    
        return res.status(200).json({
            msg:  "Student enrolled in the course successfully!!",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({  msg: "Server error while enrolling student in course" })
    }
}

export {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getNewCourses,
    getTopRatedCourse,
    getAllCoursesOfTeacher,
    getAllEnrolledCourses,
    enrollInCourse
}