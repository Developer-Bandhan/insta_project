import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js'
import {getAllPost, addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getCommentsForSinglePost, getUserImagePosts, getUserVideoPosts, getVideoPosts, likePost } from '../controllers/post_controller.js';

const router = express.Router();

// router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/addpost').post(
    isAuthenticated,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]),
    addNewPost
);

router.route('/all').get(isAuthenticated, getAllPost);
// router.route('/all/image').get(isAuthenticated, getImagePosts);
router.route('/all/reels').get(isAuthenticated, getVideoPosts);
router.route('/userpost/image').get(isAuthenticated, getUserImagePosts);
router.route('/userpost/reels').get(isAuthenticated, getUserVideoPosts);
router.route('/:id/like').get(isAuthenticated,  likePost);
router.route('/:id/dislike').get(isAuthenticated,  dislikePost);
router.route('/:id/comment').post(isAuthenticated,  addComment);
router.route('/:id/comment/all').post(isAuthenticated,  getCommentsForSinglePost);
router.route('/delete/:id').delete(isAuthenticated,  deletePost);
router.route('/:id/bookmark').get(isAuthenticated,  bookmarkPost);



export default router;