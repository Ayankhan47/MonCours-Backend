import lectureModel from '../models/lecture.model.js';
import courseModel from '../models/course.model.js';
import e from 'express';

export const getAllLectures = async (req, res)=>{
    try{
        const{courseId}= req.params;
        const course = await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message: "Course Not found"
            })
        }
        const Lectures = await lectureModel.find({courseId: courseId});
        res.status(200).json({
            success:true,
            message: "Lectures fetched successfully",
            Lectures  
        })
    } catch(error){
        res.status(500).json({
            success:false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const createLecture = async (req, res) => {
    try{
        const { title, description, videoURL} = req.body;
        const {courseId} = req.params;
        
        const course = await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message: "Course not found"
            })
        }
    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only add lectures to your own course."
      });
    }
        const Lecture = await lectureModel.create({
            title,
            description,
            videoURL,
            courseId
        });
        res.status(201).json({
            success:true,
            message: "Lecture created successfully",
            data : Lecture
        })
    } catch(error){
        res.status(500).json({
            success:false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const updateLecture = async (req, res) => {
    try{
        const {LectureId} = req.params;
        const{title, description, videoURL} = req.body;
        const Lecture = await LectureModel.findById(LectureId);
        if(!Lecture){
            return res.status(404).json({
                success:false,
                message: "Lecture not Found"
            })
        }
    }catch(error){
        res.status(500).json({
            success:false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const deleteLecture = async (req, res) =>{
    try{
        const {LectureId} = req.params;
        const Lecture = await LectureModel.findById(LectureId);
        if(!Lecture){
            return res.status(404).json({
                success:false,
                message: "Lecture not Found"
            })
        }
        await LectureModel.findByIdAnddelete(LectureId);
        res.status(200).json({
            success:true,
            message: "Lecture deleted successfully",
            data: Lecture
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error: error.message
        })
    }
}