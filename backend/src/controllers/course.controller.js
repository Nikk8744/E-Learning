import { isValidObjectId } from "mongoose";
import { Course } from "../models/course.model";
import { User } from "../models/user.model";

const createCourse = async(req, res) => {
    const [title, description, price, material] = req.body;
    const teacherId = req.user?.id;

    if(
        [title, description, teacher, price, material].some((field) => field?.trim() === "")
    ){
        return res.status(400).json({ msg: "All fields are required"})
    }

    try {
        const teacher = await User.findById({teacherId});
        if(teacher.role !== "Teacher"){
            return res.status(401).json({ msg: "Only teachers can create a course"})
        }
    
        const course = await Course.create({
            title,
            description,
            price,
            material,
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
        const courses = await Course.find().populate('teacherId', 'name email').populate('reviews');
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
        const course = await Course.findById(courseId).populate('teacherId', 'name email').populate('reviews');
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

const updateCourse = async(req, res) => {}

const deleteCourse = async(req, res) => {}

export {
    createCourse,
    getAllCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
}