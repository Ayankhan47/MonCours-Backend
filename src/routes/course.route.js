import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import identifyRole from '../middleware/identifyRole.js';
import validateCourse, {
  validateCourseUpdate,
} from '../middleware/validateCourse.js';
import validateObjectId from '../middleware/validateObjectId.js';
import {getCourses, createCourse, deleteCourse, updateCourse} from '../controllers/course.controller.js';
import {enrollCourse, getEnrolledCourses, unenrollCourse} from '../controllers/enrollment.controller.js';
import {getAllLectures , createLecture, updateLecture, deleteLecture} from '../controllers/lecture.controller.js';

const router = express.Router();

router.get('/getcourses',verifyToken, getCourses);
router.post('/createcourse',verifyToken,identifyRole("admin","instructor"),validateCourse, createCourse);
router.delete('/deletecourse/:courseId',verifyToken,identifyRole("admin","instructor"), validateObjectId("courseId"), deleteCourse);
router.patch('/updatecourse/:courseId',verifyToken,identifyRole("admin","instructor"), validateObjectId("courseId"), validateCourseUpdate,updateCourse);
router.post('/enroll/:courseId',verifyToken,identifyRole("student","instructor"), validateObjectId("courseId"), enrollCourse);
router.get('/enrolledcourses',verifyToken, identifyRole("student","instructor"),getEnrolledCourses);
router.delete('/unenroll/:courseId',verifyToken, identifyRole("student","instructor"), validateObjectId("courseId"),unenrollCourse);
router.get('/:courseId/getlectures',verifyToken, identifyRole("student","instructor"), validateObjectId("courseId"),getAllLectures);
router.post('/:courseId/createlecture',verifyToken, identifyRole("instructor","admin"), validateObjectId("courseId"),createLecture);
router.patch('/:courseId/updatelecture/:lectureId',verifyToken, identifyRole("instructor", "admin"), validateObjectId("courseId", "lectureId"),updateLecture);
router.delete('/:courseId/deletelecture/:lectureId',verifyToken, identifyRole("instructor", "admin"), validateObjectId("courseId", "lectureId"),deleteLecture);
export default router;