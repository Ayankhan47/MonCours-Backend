import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import identifyRole from '../middleware/identifyRole.js';
import {getCourses, createCourse, deleteCourse, updateCourse} from '../controllers/course.controller.js';
import {enrollCourse, getEnrolledCourses, unenrollCourse} from '../controllers/enrollment.controller.js';
import {getAllLectures , createLecture, updateLecture, deleteLecture} from '../controllers/lecture.controller.js';

const router = express.Router();

router.get('/getcourses',verifyToken, getCourses);
router.post('/createcourse',verifyToken,identifyRole("admin","instructor"), createCourse);
router.delete('/deletecourse/:courseId',verifyToken,identifyRole("admin","instructor"), deleteCourse);
router.patch('/updatecourse/:courseId',verifyToken,identifyRole("admin","instructor"), updateCourse);
router.post('/enroll/:courseId',verifyToken,identifyRole("student","instructor"), enrollCourse);
router.get('/enrolledcourses',verifyToken, identifyRole("student","instructor"),getEnrolledCourses);
router.delete('/unenroll/:courseId',verifyToken, identifyRole("student","instructor"),unenrollCourse);
router.get('/:courseId/getlectures',verifyToken, identifyRole("student","instructor"),getAllLectures);
router.post('/:courseId/createlecture',verifyToken, identifyRole("instructor","admin"),createLecture);
router.patch('/:courseId/updatelecture/:lectureId',verifyToken, identifyRole("instructor", "admin"),updateLecture);
router.delete('/:courseId/deletelecture/:lectureId',verifyToken, identifyRole("instructor", "admin"),deleteLecture);
export default router;