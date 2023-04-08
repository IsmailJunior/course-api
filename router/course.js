const express = require( 'express' );
const router = express.Router();
const courseController = require( '../controller/course' );
const catchAsync = require( '../utils/catchAsync' );

router.route( '/' ).get( catchAsync( courseController.index ) );
router.route( '/admin' ).get( catchAsync( courseController.renderAdmin ) );
router.route( '/admin/course/:courseId/new-lecture' ).get( catchAsync( catchAsync( courseController.renderNewLecture ) ) );
router.route( '/admin/course/:courseId/:lectureId' ).get( catchAsync( courseController.renderLecture ) );
router.route( '/admin/new' ).get( courseController.renderNewCourse ).post( catchAsync( courseController.createCourse ) );
router.route( '/admin/course/:courseId/:lectureId' ).put( catchAsync( courseController.updateLecture ) );
router.route( '/admin/course/:courseId/new-lecture' ).post( catchAsync( courseController.createLecture ) );
router.route( '/admin/course/:courseId' ).delete( catchAsync( courseController.deleteCourse ) );
router.route( '/admin/course/:courseId/:lectureId' ).delete( catchAsync( courseController.deleteLecture ) );

module.exports = router;