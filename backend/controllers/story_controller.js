import { Story } from '../models/story_model.js';
import { cloudinary } from '../utils/cloudinary.js';
import sharp from 'sharp';

export const getNewStory = async (req, res) => {
    try {
        const authorId = req.id; // Assuming req.id is the author's ID

        // Fetch media (image or video)
        const media = req.files.image ? req.files.image[0] : req.files.video ? req.files.video[0] : null;
        if (!media) return res.status(400).json({ message: 'Either image or video is required', success: false });

        let mediaUrl = '';
        let mediaType = '';

        // Handle image upload
        if (media.mimetype.startsWith('image/')) {
            const optimizedImageBuffer = await sharp(media.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();

            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            mediaUrl = cloudResponse.secure_url;
            mediaType = 'image';
        } 
        // Handle video upload
        else if (media.mimetype.startsWith('video/')) {
            const fileUri = `data:video/mp4;base64,${media.buffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri, { resource_type: 'video' });
            mediaUrl = cloudResponse.secure_url;
            mediaType = 'video';
        } else {
            return res.status(400).json({ message: 'Unsupported media type', success: false });
        }

        // Calculate expiry date for 24 hours
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Create new story without caption
        const story = await Story.create({
            author: authorId,
            [mediaType]: mediaUrl,
            timestamp: Date.now(),
            expiresAt,
            isDeleted: false,
        });

        // Respond with created story
        return res.status(201).json({
            message: 'New story created',
            success: true,
            story,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

import cron from 'node-cron';

cron.schedule('0 * * * *', async () => {
    try {
        // Find and update expired stories
        const currentDate = new Date();
        const expiredStories = await Story.updateMany(
            { expiresAt: { $lt: currentDate }, isDeleted: false },
            { isDeleted: true }
        );
        console.log(`${expiredStories.modifiedCount} expired story(ies) marked as deleted.`);
    } catch (error) {
        console.error('Error updating expired stories:', error);
    }
});