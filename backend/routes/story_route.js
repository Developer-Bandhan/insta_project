import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { getNewStory } from '../controllers/story_controller.js';

const router = express.Router();

router.route('/addstory').post(isAuthenticated, upload.fields([
    { name: 'image', maxCount: 1},
    { name: 'video', maxCount: 1},
]), getNewStory)

export default router;