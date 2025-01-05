import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});



// Named exports
export { cloudinary };




// import {v2 as cloudinary} from 'cloudinary'
// import dotenv from 'dotenv'
// dotenv.config({})

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret:process.env.API_SECRET
// });

// export default cloudinary;

// export const uploadVideoToCloudinary = async (videoBuffer) => {
//   try {
//       const uploadResponse = await cloudinary.uploader.upload(videoBuffer, {
//           resource_type: 'video', // specify the resource type as video
//           chunk_size: 6000000,  // Example chunk size for large videos
//       });
//       return uploadResponse;
//   } catch (error) {
//       console.log("Error uploading video: ", error);
//       throw new Error("Video upload failed");
//   }
// };


/*  
  prothome amra cloudinary install korbo, tarpor cloudinary theke 
  v1 require korbo, tarpor dotenv import korbo, sathe dotenv config korbo
  .env file a cloud_name, api_kei egula ache bole amader dotenv proyojon hobe

  tarpor cloudinary config korte hobe, sathe cloud_name, api_key, 
  api_secret pathate hobe. 

*/