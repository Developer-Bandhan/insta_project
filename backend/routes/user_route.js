import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user_controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);


export default router;


/* 
   router define korar jonno, amader prothome express import korte hobe, tarpor akta akta kore route define korte hobe, 
   tarpor router variable er modhe express.Router() define korte hobe.

   jokhon controller gulo define korbo tokhon automatic controller gulo import hobe, r jdi na hoy tahole nije theke korte,
   hobe, r controller er file gulo import korar somoy '.js' lagate hobe.

   app.use('/api/v2/user', userRoute)
   index.js file (main file) eta define korte hobe, prothome userRoute variable a define korte hobe 'import userRoute from './routes/user_route.js''
   URL a prothome 'api/v2/user/' ata add hobe localhost er sathe, tarpor userRoute theke sob route gulo asbe, jei route a amra request 
   pathabo, sei route a jabe 

   authentication check koara jonno isAuthenticated middleware import korte hobe,
   
   image upload korar jonno multer.js use korte hobe, tarpor upload.single


   router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
   The line upload.single('profilePicture'), editProfile ekta middleware stack er part, ja Express.js diye Node.js e route handler e use kora hoy. 
   Ei line-er mane holo:

   upload.single('profilePicture'): Ei middleware function file upload handle kore. Eta mane server ekta single file expect korbe request theke, 
   file-er key name hobe 'profilePicture'. upload ekta library-er instance, shadharonoto Multer, ja file upload manage korte use kora hoy Express e.

   editProfile: Eta holo porer middleware ba controller function, ja upload middleware (upload.single) complete howar por request ke process kore. 
   Ei function er moddhe user-er profile update korar logic thake, including upload kora file-er details save kora.

*/