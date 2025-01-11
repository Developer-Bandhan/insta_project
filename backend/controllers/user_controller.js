import { User }  from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import { cloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post_model.js";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(401).json({
                message: "Somthing is missing, please check!",
                success: false
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                message: "Try different email",
                success: false
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });
        
    } catch (error) {
        console.log(error);
    }
}



export const login = async (req, res) => {
  try {

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(401).json({
            message: "Somthing is missing, please check!",
            success: false
        });
    }

    let user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message: "Don't have any account, please Sign up",
            success: false
        })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            message: "Incorrect email or password",
            success: false
        })
    }
    const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

    //populate each post 
    const populatedPosts = await Promise.all(
        user.posts.map(async (postId) => {
            const post = await Post.findById(postId)
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        })
    )
    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatedPosts
    }

    
    return res.cookie('token', token, {httpOnly: true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
    })
    

    
  } catch (error) {
    console.log(error);
  }
}


export const logout = async (_, res) => {
    try {
        return res.cookie('token', "", {maxAge: 0}).json({
            message: 'Logged out successfully',
            success: true
        });
        
    } catch (error) {
        console.log(error);
    }

}


export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path: 'posts', createdAt:-1}).populate('bookmarks');

        return res.status(200).json({
            user, 
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }
}


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;
        
        await user.save();

        return res.status(200).json({
            message: "Profile updated",
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: "Currently do not have any users",
                success: false
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
        
    } catch (error) {
        console.log(error);
    }
}


export const followOrUnfollow = async (req, res) => {
    try {
        const logedInUserId = req.id; // j login ache, mane ami 
        const targetUserId = req.params.id; // jake ami follow korbo
        
        if(logedInUserId == targetUserId){
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        };
        const logedInUser = await User.findById(logedInUserId);
        const targetUser = await User.findById(targetUserId);

        if(!logedInUser || !targetUser){
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        // now check korbo follow karbo na unfollow
        const isfollowing = logedInUser.following.includes(targetUserId);
        if(isfollowing){
            // unfollow 
            await Promise.all([
                User.updateOne({_id: logedInUserId}, {$pull: {following: targetUserId}}),
                User.updateOne({_id: targetUserId}, {$pull: {followers: logedInUserId}})
            ])
            return res.status(200).json({
                message: 'Unfollow successfully',
                success: true
            })

        } else {
            //follow
            await Promise.all([
                User.updateOne({_id: logedInUserId}, {$push: {following: targetUserId}}),
                User.updateOne({_id: targetUserId}, {$push: {followers: logedInUserId}})
            ])
            return res.status(200).json({
                message: 'Follow successfully',
                success: true
            })
        }
        
    } catch (error) {
     console.log(error);
    }
}










/*  --- register --   

   1. register korar jonno username, email, password lagbe egula req.body theke asbe, amra from submit korar por submitted data gulo 
   req.body er theke access korte pari
   amra ekhane ' {username, email, password} ' erokom vabe likhechi, etake object destructuring bole etar madhome req.body object theke
   egulo amra access krote parbo, noyto amra alada alada kore korte hobe......
   example: 
     const username = req.body.username;
     const email = req.body.email; etc


    2. tarpor amra condition lagabo, jdi username, email r password na thake tahole res a status 401 pathano hobe r json msg pathano hobe, 
    r success false hobe. 

    3. tarpor check korbo same email ID diye user age theke registered chilo kina, ei line er madhome,
         const user = await User.findOne({email}); ...... ekhane findOne() er vetore email lekha ache karon amra email er madhome user khojar chesta korchi.

        jodi user same email ID theke age theke registered thake tahole user k abr registered hote debo na, res.status(401) pathabo sathe msg 
   
    4. jdi same email a old user na thake tahole amra User create korbo, r user a sudhu required jinis guloi pathabo...
       password k amra database a hashing kore store korbo, hashing korar jonno bcrypt use korbo, tar jonno amader bcrypt.hash function use korbo 
       sathe password pathabo, r koto word er solt add korte chai seta pathabo, ekhane 10 word, tarpor User.create a password er vetor hashedPassword
       store korbo. 

    5. tarpor acta message return kore debo res.statues er madhome, r status code 201 pathabo jokhon kichu create hoy tokhon 201 status code use kora hoy 

*/





/*  --- login ---

 1. login er jonno amra {email, password} nebo req.body theke, egulo jdi na thake tahole res.status return korbo.
    

 2. tarpor User exist kore kina seta email er madhome check korbo, same register er moto, kintu ekhane jdi email age 
    theke registered na thake tahole login korte debo na, karon jdi user registered na thake tahole take age register
    korte bolbo. login er user let diye define korbo, karon user pore change o hote pare, mane acta user vul hole same person 
    onno user o dite pare. tai let diye define karte hobe, const use kora jbe na


 3. tarpor old user password er sathe notun dewa password er compare korbo jdi match na hoy tahole ' incurrect password return korbo '
    eta amra bcrypt er sathe compare method use korbo, etate new password pass korbo sathe user.password compare korbo


 4. tarpor amader token generate korte hobe, token er madhome bojha jay user authenticated ache ki nei, token amra browser er cookie te store kori
    jotokhon token cookie te store thakbe totokhon user authenticated thakbe, user logout hole gele token delete hoye jbe, ba token delete hoye gele
    user logout hoye jbe, token er acta time limit thake.

    token create korar jonno jwt(jsonwebtoken) use korbo, jwt er sathe sign() method use korbo (jwt.sign()), sign method er vetore 
    token data provide korbo, jegulo holo, userID jeta mongodb user table theke nebo (user._id), secret_key jeta .env te create kora hoyeche, 
    token er expirey date dite hobe (expiresIn: '1d') amra 1 din er debo.

5. tarpor generated token take cookie te store korte hobe, 'return res.cookie()' er madhome  cookie er vetore variable name dite hobe jeta ekhane " 'token' ",
   tarpor amra securitey er jonno kichu jinis provide korbo, {httpOnly: true, sameSite: 'strict', maxAge: 1*24*60*60*1000}.json({}) tarpor coocie er sathe json
   responce return korbo, json responce er sathe clint side a user er details send korbo.

6. tarpor amra user return korbo jate frontend side a amra save korte pari, tar jonno user object k modify korbo, password bade baki sob jinis pathabo.

7. amon chai jate, jokhon user login korbe tokhon user er sob post gulo dekha jay, etar jonno login route a user create korar somoy populate kore post ber korte
   hobe. 


*/



/*   --- logout ---

 1. logout er jonno amader sudhu cookie er vetore j token ta ache seta k delete korte hobe, 
    delete kore debo mane token er value take empty string kore debo, r maxAge: 0 kore debo

    return res.cookie('token', "", {maxAge: 0}).json({})
      ekhane cookie return kora hoche, 'token' variable name, " " empty string(value) sathe json data send korbo.

*/




/*  --- getProfile ---

 1. instagram a amr account theke amr profile chara onno karor o profile dekhte pari, onno normal website a erokom hoy na (ex: zoom, ecommarce),
    tai amra user er madhome getProfile korbo na, ID er madhome getPrfile korbo. r sei Id amra 'req.params.id' theke pabo,
    
 2. tarpor userId diye user find korbo, tarpor user r msg return korbo.

*/





/*  --- edit profile ---

  1. amra sudhu nijer profile e edit korte pari, tai amra bujhbo ki kore j jar profile edit korte jachi se logedIn user er profile, tai amra cookie token 
     use korbo, amra login korar somoy token data hisebe userId pathiyechilam, amra cookie theke userID nebo, setai hobe logedin user, abong se tar profile 
     edit korte parbe. logedin user check korar jonno middleware use korte hoy.

     (amra aro akta podhotite logedin user khujte pari, jodi amra frontend theke id share kori tahole logedin user bujhte parbo. kintu eta korchi na ekhane)

  2. tarpor amra isAuthenticated middleware banabo, jetate token theke asa userId er logic thakbe, etar madhome amra bujhte parbo, user ligin ache kina, sathe 
     token er modhe jei userId thakbe seta theke amra bujhte parbo j ota login user kina.

  3. tarpot amra req.id theke userid niye nebo, (req.id jeta isAuthenticated middleware a store korechilam)

  4. amra editProfile a bio gender edit korte parbo, tai egula req.body theke niye nebo, 
  
  5. user tar profile er picture o edit korte tai amra cloudinary setup korbo, cloudinary.js file create korbo, tarpor cloudinary dashboard theke API_KEY, API_SECRET, CLOUD_NAME use korbo, egulo .env te store korbo
     amra profile picture req.file theke nebo, amader image theke server a upload korar jonno dataURI convert korte hobe.
     (File upload er somoy, server file ta binary format e receive kore (buffer). Ei raw binary data ke directly use kora jhamelar, tai amra Data URI e convert kori.)

     dataURI install korte hobe, (npm i datauri)
     tarpor datauri.js file banabo utils er vetore 

  6. tarpor fileUri variable a getDataUri function k user korbo. (jeta datauri.js file a define karo ache)

  7. tarporcloudinary install korbo, tarpor cloudinary setup korbo.

  8. cloudResponse = await cloudinary.uploader.upload(fileUri);
     
     Ei line Cloudinary er uploader.upload() method use kore file er Data URI (fileUri) ke Cloudinary server e upload kore, 
     ebong tar response object cloudResponse variable e store kore. Ei response e file er secure URL, size, format, MIME type, etc. 
     thake. File upload successful hole, ei URL database e store kora jay ba future reference er jonno use kora hoy. Cloudinary er      
     secure server e file host korar fole file easily access kora jay ebong safe thake.

     uploader.upload() Cloudinary library-r ekta method, ja Cloudinary server-e files upload korar jonno use hoy. Ei method file er 
     location ba Data URI accept kore, file ta Cloudinary server-e upload kore, ebong ekta response object return kore. Response object 
     e file er important information thake, jemon file er secure URL, size, format, MIME type, etc. Ei secure URL database e store kore 
     file easily access kora jay. Cloudinary server file securely host kore, tai file manage kora aro convenient hoy.

  9. tarpor user k findById korbo, karon user na thakle edit kake korbo, eta na korleo cholbe

  10. tarpor protitar condition lagabo, jdi updated bio thake tahole bio update korbo, sathe sob er jonno protita 
     if condition lagabo, cloudResponce a profile picture er URI ache tai profilePicture a cloudResponce.secure_url store korbo,
     tarpor user save() korbo database a tarpor responce return korbo. 

*/


/*  --- getSuggestedUsers ---

  1. const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");

  Ei line ti database theke emon shob users khuje ber kore jader _id current user er ID (req.id) er soman noy. 
  Arthaat, eta current user chara onno shob user ke retrieve kora hoy. User.find({_id: {$ne: req.id}}) ei MongoDB 
  query er madhyome data filter kora hoy, jekhane $ne mane not equal. .select("-password") use kora hoy jate protiti 
  user er password field ta bad diye dewa hoy, jate sensitive information return na hoy. Sob user data filter howar por, 
  egulo suggestedUsers name e ekta variable e store kora hoy.

  2. tarpor condition check kora hoy jdi suggested user na thake tahole acta responce return kora hoy, tarpor if er baire 
     abr r acta responce return kora hoy, jeta suggested user thakle jabe, sathe sob suggested user gulo send kora hoy. 
   

*/



/*  --- followOrUnfollow ---

  1. prothome amader logedIN user er id store korte hobe, jeta amra req.id theke 'logedInUserId' etate store korbo.
     tarpor amra jake follow korbo tar id req.params.id theke 'targetUserId' eta te store korbo.

  2. tarpor check korbo j, jdi logedInUser or targerUser id same hole, msg return korbo, ' you can't follow yourself '

  3. tarpor amra loginUser or targetUser nite hobe, jeta amra findById er madhoeme User model theke duto user store kore nebo.
     tarpor check korbo ei dutor modhe jdi kno acta na thake tahole error return korbo. 

  4. tarpor eta check korbo follow korte hobe na unfollow, amra jake follow kori tar account amader following a add hoy,
     r jake follow kori tar account a amar accunt followers a add hoy, tai amr following a check korbo jar accunt dekhchi,
     se amr following a ache kina, jdi thake tahole unfollow show korbe, r na thakle follow show korbe.
     
     eta korar jonno amra acta isFollowing variable banabo, tarpor user.following a includes method a targetUser er ID pathabo,
     jehetu following acta array tai etate 'includes' method work korbe.

     tarpor targetUser er followers a logedInUser er id puch korbo, r logedInUser er following a targetUser er id pudh korbo, 
     same unfollow korar jonno likhno, but ebr push er bodole pull korbo. 

  5. //unfollow
    await Promise.all([
                User.updateOne({_id: logedInUserId}, {$pull: {following: targetUserId}}),
                User.updateOne({_id: targetUserId}, {$pull: {followers: logedInUserId}})
            ])
  

    Eikhane await Promise.all() function use kora hoyeche duita database update operation ek shathe concurrently execute korar jonno, 
    better performance er jonno. Ei operation gulo dujon user-er data update kore, jekhane tara ekjon ar ekjon ke follow korte pare, 
    social media-like application e.

    Prothom operation, User.updateOne({_id: logedInUserId}, {$pull: {following: targetUserId}}), logedInUserId er following array theke 
    targetUserId ke remove kore. Eta bojhai je logged-in user ar target user ke follow korche na. Same vabe, ditiyo operation, 
    User.updateOne({_id: targetUserId}, {$pull: {followers: logedInUserId}}), targetUserId er followers array theke logedInUserId ke 
    remove kore. Eta ensure kore je target user ar logged-in user ke tar follower hisebe dekhte pabe na.

    Promise.all() use korar madhyome duita operation ek shathe cholte pare, jar fole total execution time kom hoye efficiency bare sequential 
    operation er chaite. await ensure kore je code er next line e jawar age duita promise resolve hobe, mane duita database update operation 
    complete hobe.

*/
