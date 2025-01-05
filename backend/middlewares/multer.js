import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage(),
});

export default upload;

/* 
  multer use korar jonno prothome install korte hobe, 'npm i multer' tarpor import korte hobe  
  tarpot multer define korte hobe

*/



// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
//   fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
//           cb(null, true);
//       } else {
//           cb(new Error("Only images and videos are allowed"), false);
//       }
//   },
// });
