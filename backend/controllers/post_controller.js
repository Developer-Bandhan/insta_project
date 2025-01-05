import sharp from 'sharp';
import { cloudinary } from '../utils/cloudinary.js';
import { Post } from '../models/post_model.js'
import { User } from '../models/user_model.js';
import { Comment } from '../models/comment_model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';


export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const authorId = req.id;

        // fetch media (image or video)
        const media = req.files.image ? req.files.image[0] : req.files.video ? req.files.video[0] : null;
        if(!media) return res.status(400).json({message: 'Eithor image or video is required', success: false});

        let mediaUrl = '';
        let mediaType = '';

        if(media.mimetype.startsWith('image/')){
            // Image upload logic 
            const optimizedImageBuffer = await sharp(media.buffer)
                  .resize({width: 800, height: 800, fit: 'inside'})
                  .toFormat('jpeg', {quality: 80})
                  .toBuffer();

            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            const cloudResponce = await cloudinary.uploader.upload(fileUri);
            mediaUrl = cloudResponce.secure_url;
            mediaType = 'image';
        } else if(media.mimetype.startsWith('video/')){
            // video upload logic
            const fileUri = `data:video/mp4;base64,${media.buffer.toString('base64')}`;
            const cloudResponce = await cloudinary.uploader.upload(fileUri, { resource_type: 'video' });
            mediaUrl = cloudResponce.secure_url;
            mediaType = 'video';
        } else {
            return res.status(400).json({ message: 'Unsupported media type', success: false });
        }

        const post = await Post.create({
            caption,
            [mediaType]: mediaUrl,
            author: authorId,
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({path: 'author', select: '-password'});

        return res.status(201).json({message: 'New post added', success: true, post});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error', success: false});
    }
}



export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const getVideoPosts = async (req, res) => {
    try {
        // Fatch only post width an image (filter by 'image field existence)
        const posts = await Post.find({ video: {$exists: true}})
             .sort({ createdAt: -1})
             .populate({ path: 'author', select: 'username profilePicture'})
             .populate({
                path: 'comments',
                sort: { createdAt: -1},
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
             });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false});
    }
}

export const getUserImagePosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId, image: {$exists: true} })
        .sort({createdAt: -1})
        .populate({
            path:'author',
            select:'username profilePicture'
        })
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate: {
                path:'author',
                select:'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }
}

export const getUserVideoPosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId, video: {$exists: true} })
        .sort({createdAt: -1})
        .populate({
            path:'author',
            select:'username profilePicture'
        })
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate: {
                path:'author',
                select:'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        // j like korbe tar id
        const logedInUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:'Post not found', success: false});
        
        // like logic started
        await post.updateOne({$addToSet:{likes:logedInUser}});
        await post.save()

        // implement socket.io for realtime notification
        const user = await User.findById(logedInUser).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if(postOwnerId != logedInUser) {
         // emit a notification event
         const notification = {
            type: 'like',
            userId: logedInUser,
            userDetails: user,
            postId,
            message: 'Your post was liked'
         }
         const postOwnerSocketId = getReceiverSocketId(postOwnerId);
         io.to(postOwnerSocketId).emit('notification', notification);
        } 


        return res.status(200).json({message: 'Post liked', success:true});

    } catch (error) {
        console.log(error);
    }
}
export const dislikePost = async (req, res) => {
    try {
        const logedInUser = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        // Dislike logic
        await post.updateOne({ $pull: { likes: logedInUser } });

        // Implement socket.io for dislike if needed (optional)
        // Example: io.to(post.authorId).emit('postDisliked', { userId: logedInUser, postId });

        const user = await User.findById(logedInUser).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if(postOwnerId != logedInUser) {
         // emit a notification event
         const notification = {
            type: 'dislike',
            userId: logedInUser,
            userDetails: user,
            postId,
            message: 'Your post was liked'
         }
         const postOwnerSocketId = getReceiverSocketId(postOwnerId);
         io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};


export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const logedInUserId = req.id;
        const {text} =req.body;
        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({
            message: 'text is required',
            success: false
        });

        const comment = await Comment.create({
            text, 
            author: logedInUserId,
            post: postId
        })

        await comment.populate({
            path:'author',
            select:'username profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment Added',
            success: true,
            comment
        });
        
    } catch (error) {
        console.log(error);
    }
}

export const getCommentsForSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId})
        .populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({message:'No comments found for this post', success: false})

        return res.status(200).json({success:true, comments})
        
    } catch (error) {
        console.log(error);
    }
  
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:'Post not found', success: false})

        // check if the logedIn user is the owner of the post 
        if(post.author.toString() != authorId) return res.status(403).json({message:'Unauthorized'})

        // delete post 
        await Post.findByIdAndDelete(postId);

        // remove the post id from the users post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() != postId)
        await user.save();

        //delete associated comments 
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message:'Post deleted',
            success: true
        })
        
    } catch (error) {
        console.log(error);
    }
}



export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:'Post not found', success:false})

        const user = await User.findById(authorId);

        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from bookmark
            await user.updateOne({$pull: {bookmarks:post._id}});
            await user.save()
            return res.status(200).json({
                type:'unsaved',
                message:'Post removed from bookmark',
                success:true
            })
        } else {
            // bookmark
            await user.updateOne({$addToSet: {bookmarks:post._id}});
            await user.save()
            return res.status(200).json({
                type:'saved',
                message:'Post bookmarked',
                success:true
            })
        }
        
    } catch (error) {
        console.log(error);
    }

}



// export const addNewPost = async (req, res) => {
//     try {
//         const {caption} = req.body;
//         const image = req.file;
//         const authorId = req.id;

//         if(!image) return res.status(400).json({message: 'Image required'});

//         // image upload
//         const optimizedImageBuffer = await sharp(image.buffer)
//         .resize({width:800, height:800, fit:'inside'})
//         .toFormat('jpeg', {quality:80})
//         .toBuffer();

//         // buffer to data uri
//         const fileUri = `data:image/jpeg;base64;${optimizedImageBuffer.toString('base64')}`;
//         const cloudResponce = await cloudinary.uploader.upload(fileUri);
//         const post = await Post.create({
//             caption,
//             image: cloudResponce.secure_url,
//             author: authorId
//         });

//         const user = await User.findById(authorId);
//         if(user){
//             user.posts.push(post._id);
//             await user.save();
//         }
//         await post.populate({path: 'author', select:'-password'});

//         return res.status(201).json({
//             message: 'New post added',
//             success: true,
//             post
//         })
        
//     } catch (error) {
//         console.log(error);
//     }
// }


// export const getImagePosts = async (req, res) => {
//     try {
//         // Fatch only post width an image (filter by 'image field existence)
//         const posts = await Post.find({image: {$exists: true}})
//              .sort({ createdAt: -1})
//              .populate({ path: 'author', select: 'username profilePicture'})
//              .populate({
//                 path: 'comments',
//                 sort: { createdAt: -1},
//                 populate: {
//                     path: 'author',
//                     select: 'username profilePicture'
//                 }
//              });

//         return res.status(200).json({
//             posts,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Server error', success: false});
//     }
// }


/*  --- addNewPost--image--video ---

   1. prothome caption niye nebo, req.body theke jeta frantend theke asbe, tarpor authorId store korbo req.id theke jeta 
      authentication er somoy store kora hoyeche. 

   2. const media = req.files.image ? req.files.image[0] : req.files.video ? req.files.video[0] : null;

      const media = req.files.image ? req.files.image[0] : req.files.video ? req.files.video[0] : null; ei line-ta req.files 
      object-er moddhe image ba video ase kina ta check kore. Prothome req.files.image check kora hoy, jodi seta exist kore, 
      tahole tar prothom element (req.files.image[0]) media te assign hoy. Jodi image na thake, tokhon req.files.video check hoy, 
      r jodi seta thake, tahole tar prothom element (req.files.video[0]) assign hoy. Jodi kono ta-i na thake, tahole media null 
      set hoy.

      req.file ba req.file.image || req.file.video use korle kaj kore na karon req.files use korar jonno multer middleware 
      file-ta as an array handle kore. Tar mane image ba video property array-r modhye store hoy, ar req.file direct ekta 
      single file-r jonno kaj kore.

      Tumi thik bolecho, post create korar somoy ekta image ba ekta video post kora hochhe. Tahole keno req.files.image ba 
      req.files.video array hisebe handle kora hochhe?

      Eta multer middleware-er configuration-er upor nirbhar kore. Multer file upload handle kore array format-e jodi 
      multi-file upload setup thake. Mane holo, jodi form theke multiple files pathano hoy, tahole segulo req.files.image ba 
      req.files.video array-r moddhe store hoy.

      Kintu jodi sure thako je user ekmatro ekta image ba ekta video pathabe, tahole multer-er single() method use korte paro. 
      Tokhon req.file direct ekta file represent korbe, array lagbe na.
      const upload = multer({ storage }).single('image'); // ekta file upload er jonno

   3.  if (media.mimetype.startsWith('image/')) {
      media.mimetype.startsWith('image/') line-ta file-er MIME (Multipurpose Internet Mail Extensions) type check kore, jate 
      bujha jay file-ta ekta image ki na.Ekhane media variable user-uploaded file represent kore, ebong tar moddhe mimetype 
      property file-er type er information dey MIME standard follow kore. For example, jodi file-ta ekta JPEG image hoy, 
      tahole mimetype hobe image/jpeg.

      startsWith('image/') method check kore mimetype string-ta 'image/' diye shuru hoy ki na. Jodi hoy, tahole bujha jabe je 
      file-ta ekta image type-er (e.g., PNG, JPEG). Ei check er maddhome video ba onnanno unsupported type filter out kora hoy.

    4. const optimizedImageBuffer = await sharp(media.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();

      Ei code-e sharp library use kore uploaded image process kora hocche. Prothome sharp(media.buffer) diye image-er buffer data 
      process er jonno ekta instance toiri kora hoy. Tarpor .resize({ width: 800, height: 800, fit: 'inside' }) method use kore 
      image-er resolution adjust kora hoy, jate width ba height 800 pixel-er beshi na hoy, kintu original aspect ratio maintain 
      thake.

      Tarpor .toFormat('jpeg', { quality: 80 }) diye image ke JPEG format-e convert kora hoy, r quality 80% rakha hoy file size 
      komanor jonno. Finally, .toBuffer() method diye optimized image-ke abar buffer format-e convert kore output hishebe ready 
      kora hoy. Ei process upload-er por image size ar quality manage kore, server er load komai.

    5. const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

      Ei line-ta optimizedImageBuffer ke base64 format-e convert kore, jar maddhome image ta ekta URI (Uniform Resource Identifier) 
      hishebe represent kora hocche. Prothome, optimizedImageBuffer.toString('base64') diye image-er binary data ke base64 format-e 
      encode kora hoy. Base64 encoding er maddhome binary data ke text format-e convert kora jay, jeta HTTP request er moddhe 
      pathano jay.

      Tarpor, data:image/jpeg;base64, diye ekta Data URI banano hoy, ja image-er type (image/jpeg) ebong encoded content ke combine 
      kore ekta URI te rakhche. Ei URI ke pore image upload kora ba display kora jabe, ja cloud storage e upload korar age image 
      ke directly client-side e represent kore.

      Jodi apnar project e file upload korte hoy (e.g., image, video), r apni chaan je sei file ta directly HTTP request e send kora 
      hok (na je server e ekta separate file upload hoy), tahole base64 encoding use korte hoy.
      Jodi apni image ke directly webpage e embed korte chan (external file link chara), tahole base64 encoding use korte hoy. Ei 
      khetre image ta URL hishebe render hoy.
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."/>

   6. const cloudResponse = await cloudinary.uploader.upload(fileUri, { resource_type: 'video' });
      
      Ei line-ta Cloudinary API ke use kore video file upload korche. cloudinary.uploader.upload(fileUri, { resource_type: 'video' }) 
      method ta Cloudinary server e video file upload kore. fileUri holo ekta base64 encoded video file, ja HTTP request-er maddhome 
      Cloudinary server e pathano hoy. resource_type: 'video' er maddhome Cloudinary ke bola hocche je, je file ta upload hochhe, 
      seta video type, jate server se file ta thik bhabe process kore. await keyword-ta asynchronous operation complete howar por 
      response ta cloudResponse variable-e store kore, jar moddhe Cloudinary server theke upload success ba failure er information 
      thake. Ei process ta asynchronous thakar karone, jodi upload successful hoy, tokhon response-pora jabe, ar code ta agiye jabe.

   7. [mediaType]: mediaUrl

      Ei line-ta dynamically decide kore je apnar media kothay store hobe, image ba video te. [mediaType] ekhane dynamic key represent 
      kore, jar mane image ba video hote pare. Apni ekhane dynamically field set korte parben, jeta image ba video hote pare, depending 
      on the file type.






*/





/* --- deletePost ---

  1. if(post.author.toString() != authorId) return res.status(403).json({message:'Unauthorized'})

     if(post.author.toString() != authorId) return res.status(403).json({message: 'Unauthorized'}) line er kaj holo ensure kora je post er author 
     (je user post ta create koreche) ar logged-in user er ID (je user ei request ta korche) same ache kina. Ei line diye authorization check kora 
     hoy, mane ei request korar permission current user er ache kina.

     Ekhane post.author ekta MongoDB ObjectId, ja post er author er unique ID represent kore. Kintu authorId ekta string, ja authentication middleware 
     theke pawa hoy. Tai post.author.toString() use kore ObjectId ke string e convert kora hoy, jate comparison properly kora jay.

     Jodi post.author ar authorId same na hoy, mane current user ei post er author na hoy, tahole server 403 Forbidden response return kore, ar ekta 
     JSON message pathay: {message: 'Unauthorized'}. Etar mane user er permission nai ei operation perform korar. Ei approach API ke secure rakhte help 
     kore, unauthorized users ke sensitive operations korte dey na.

  2. tarpor postId er madhome post findkorbo then delete korbo. (await Post.findByIdAndDelete(postId);)

*/










/* --- dislike post ---
   1. like post er moto same hobe, kintu ectu akra jaygay alada hobe. 

   2. 


*/











/*  --- addNewPost ---
 
  1. acta post create korte gele amader caption, image, r authorId lage. egulo amra niye nebo, caption frontend theke req.body
     te pass hobe, image req.file a pawa jbe, r authorId req.id theke pabo.

     amra ekhane req.id use korchi, eta authentication er somoy req.id te user er id store kora hoy tai, amra req.id theke userId 
     access korte pari.

   2. tarpor condition likhbo, image na thakle error show korte,

   3. image upload korar somoy, image size and quelity thik korar jonno sharp.js packege use kora hoy, tai etake install korte hobe
      (npm i sharp) tarpor eta import korte hobe 'import sharp from "sharp"', tarpor sharp er vetore amra image buffer use kori.

       const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'})
        .toFormat('jpeg', {quality:80})
        .toBuffer();

        Ei line ta sharp library use kore image ke optimize korte help kore. Prothome, sharp(image.buffer) diye image ta ke buffer 
        theke load kora hoyeche. Tarpor, .resize({width: 800, height: 800, fit: 'inside'}) diye image ta ke maximum 800x800 pixel 
        er moddhe resize kora hoye, kintu image er original aspect ratio thakbe, mane image distort hobe na. Tarpor, 
        .toFormat('jpeg', {quality: 80}) diye image ta ke JPEG format e convert kora hoye with 80% quality, jate image ta high quality 
        thake kintu size kom thake. Shesh porjonto, .toBuffer() diye optimized image ta buffer hishebe return kora hoye, ja next step er 
        jonno use kora jabe.
    
    4. const fileUri = `data:image/jpeg;base64;${optimizedImageBuffer.toString('base64')}`;

       Ei line ta optimized image buffer ke base64 string e convert kortese. Prothome, optimizedImageBuffer.toString('base64') diye, 
       optimizedImageBuffer ke base64 encoding e convert kora hoye. optimizedImageBuffer holo image er optimized binary data, ja sharp 
       library diye generate kora hoyeche. toString('base64') method ta ei binary data ke ekta base64 encoded string e convert kore, 
       jate sei image ta easily web browser ba API request e send kora jete pare.

       Tarpor, ei base64 string ta ke data:image/jpeg;base64; er sathe combine kora hoye, jate eta ekta valid data URI banay. 
       data:image/jpeg;base64, holo ekta prefix, ja indicate kore je eta ekta JPEG image er base64 encoded data. Sesh porjonto, 
       fileUri variable ta image er ekta base64 encoded representation hoye jay, ja image ke inline format e web page e use kora 
       ba API response e pathano jete pare. Ei process ta mainly image ke web applications e easily render kora ba transfer kora 
       jonno use kora hoy.

       Base64 e convert kora hoy image ba binary data ke text format e porinoto korar jonno, jate eta easily web application ba API 
       te transfer kora jay. Base64 encoding er maddhome, image ba any binary data ke ekta string e porinoto kora hoy, ja HTTP request 
       er body te pathano jay, ba HTML/CSS/JavaScript e directly embed kora jay.
       Base64 e convert kora image ta Data URI te convert hoy, jate image ta directly web page e render kora jay bina external file URL 
       er dorkar chara. Ei process ta data transmission er shubidha diye thake, karon binary data raw form e transmit kora onek somoy 
       problematic hoy, kintu base64 te convert korle eta text format e easily transmit hoy. Ebong, eta file system ba external storage 
       er upor depend kora chara image data ke store korte help kore.


    5. tarpor amra cloudinay use kore, cloudinary server a image k upload korbo,  

    6. tarpor amra post create korbo, post er sathe caption, image r author store korbo, author authorId theke pabo, image cloudRespone
       a store kora secure_url theke pabo.

    7. post ta kno user create korche tai, author id er madhome user find kore nobo tarpor, user er posts er modhe(mane user_model er posts section er modhe)
       new_post_id push korbo, er theke amra bujhte parbo ei post ta kon user er.
    
    8. tarpor amra post theke author populate korbo, eta frontend a post er opore user(j post ta koreche) dekhate subhidha hobe,
       
       await post.populate({path: 'author', select:'-password'});

       Ei line ta post document er author field ke populate kore tar shathe related pura details fetch kore. path: 'author' mane post 
       document er author field er reference, mane User collection er corresponding data, database theke fetch kora hobe. Populate er 
       maddhome author field ekta ObjectId theke pura object (user details) te porinoto hoy.

       select: '-password' use kore fetched data theke password field exclude kora hoy, jate sensitive information response e na thake. 
       Shesh porjonto, await ensure kore je ei populate operation ta complete howar porer result ready thakbe further use er jonno. Ei 
       process relational data efficiently handle korte help kore.


*/




/* --- getAllPost --- 
   
  1. prothome allPost post variable a niye nebo, sob post nebo tai find() er sathe 
     kno condition lagabo na, tarpor er sathe sort method lagabo, sort method lagabo,
     amra post increasing order a chai, mane jeta khon create hoyeche seta sob theke 
     upore dekhabe, khanikta stack er moto.

     amra post table er author theke username r profilePicture populate kore nebo, egulo
     post er opore userName or profilePicture show korte sahajjo korbe

     tarpor post table theke comments populate korbo, comments er sathe sort lagabo, 
     jeta new_comment seta opore dekhanor jonno, tarpor nested populate use kore, comments 
     table er author theke comment_author username or profilePicture populate korbo,

     tarpor responce send korbo, responce er sathe posts send korbo.
     

*/



/* --- getUserPost ---
  
  1. prothome authorId niye nebo req.id theke jeta authentication er somoy store korechilam,
     tarpor authorId er conditaion a post ber korbo, tarpor sort lagabo post er sathe,

     tarpor same vabe userPost er sathe populate method er madhome author table theke
     username or profilePicture nebo

     tarpor r acta populate method er madhome comments ber korbo, tarpor comments er author 
     er jonno nested populate method use korbo.

     tarpor responce send korbo


*/



/* --- likePost ---

  1. first a amra j like korbe tar id ber korbo, j ligedIn user hobe sei nischoi like korbe tai req.id theke logedInUser nebo.
     jeta suthentication er somoy req.id te store kora hoyeche.

  2. tarpor req.params.id theke postId ber kore nebo, tarpor postId use kore post ber korbo, jdi kno post na thake tahole error
     return korbo.

  3. await post.updateOne({$addToSet:{likes:logedInUser}});
  
     Ei code ti MongoDB-er updateOne method use kore, ja specific document update korar jonno bebohar kora hoy. Ekhane kichu important part ache:

     await: Eta ekta asynchronous operation ke synchronous vabe complete hote wait kore. Mane holo, code ta update operation complete howar por e 
     ager line er kaj ta complete korbe.

     post.updateOne: post holo MongoDB collection er ekta instance, ar updateOne holo ekta method ja ekta document update kore.

     {$addToSet: {likes: logedInUser}}: Ei part ti MongoDB update operation, jekhane $addToSet operator use kora hoy.

     $addToSet: Ei operator ti ekta array (ekhane likes) er modhe kono specific value (ekhane logedInUser) add kore, kintu jodi oi 
     value already array-te thake, tahole seta abar add korbe na. Mane, likes array te logedInUser ke add korbe jodi seta already thake na.

*/










/* --- addComment ---
   
   1. prothome req.params.id theke post id niye nebo, post id frantend theke asbe url er madhome
      tarpor req.id theke loggedInUser er ID nie nebo logedInUser ei jonno lagbe karon amader jante 
      hobe j commment ta k koreche, jeta authentication er somoy req.id te store 
      kora chilo, tarpor comment er text neho req.body theke jeta frantend er theke asbe,
      tarpor postId use kore post bar kore nebo.

    2. const comment = await Comment.create({
            text, 
            author: logedInUserId,
            post: postId
        }).populate({
            psth:'author',
            select:'username, profilePicture'
        });

        Ekhane, Comment.create() method use kora hoyeche notun ekta comment create korar jonno. 
        Ei method e je object pass kora hoy, tar modhe tinte main field ache:

        text: Ei field e comment er content thake, ja user likhechhe.

        author: Ei field e logged-in user er ID thake, mane je user comment ti likheche. Ei ID 
        ke logedInUserId variable theke input kora hoyeche.

        post: Ei field e je post er sathe comment ta associated, tar ID (postId) thake.

        Erpor, .populate() method use kora hoy author er details fetch korar jonno. populate() method 
        ekhane author field ke populate korche, mane je author er ID database e store kora chhilo, tar 
        sath e actual author er information (username ebong profile picture) o fetch kora hobe. 
        Ei process er madhyome, author er full information, like username and profilePicture, directly 
        comment data er sath show kora jabe, ja application er user interface e user er profile details 
        shoho comment display korte sahajjo kore.

    3.  tarpor amader post model er comments filed a comennt._id push korte hobe, etar madhome amra spacific 
        post er comment gulo khuje pabo. tarpor post save korte hobe


*/



/* --- getCommentsForSinglePost ---
  
  1. amra specific post er comment newar jonno prothome postId store korte hobe req.params.id theke
     tarpor comments find korte hobe spacific post er tai amra postId use korbo etar jonno, tai Comment schema 
     te post field add kora hoyeche. 

     tarpor amra populate kore author er username r profile picture nebo

      const comments = await Comment.find({post:postId})
        .populate('author', 'username, profilePicture');

        Ekhane apni Comment.find() diye post er comments fetch korchhen, jekhane post: postId diye filter kora hoyeche. 
        Tarpor, .populate('author', 'username profilePicture') diye author field ta populate kora hocche.

        author: Ei field ta User collection e reference dhore rakhe. populate method er maddhome apni author er actual 
        details (e.g., username and profilePicture) fetch korte parben.

        'username profilePicture': Ekhane duita field specify kora hoyeche je apni populate kore author theke kintu sudhu 
        username ebong profilePicture chaichen. Er mane, author er full document na niye sudhu duita field return korbe (optimize kora hoyeche).

*/





/* --- bookmarkPost ---
 
  1. check korbo user age theke ei post ta bookmark kore rekheche kina, jdi bookmark kore rakhe tahole post take unbookmark korbo,
     r bookmark na kora thakle post take bookmark korbo.

  2. if(user.bookmarks.includes(post._id))

     if(user.bookmarks.includes(post._id)) line ta user object er bookmarks array er moddhe post._id ache kina ta check kore. Ekhane 
     bookmarks ekta array, ja specific user er bookmarked posts er ObjectId gulo store kore. post._id ekta post er unique ObjectId, 
     ja MongoDB te create hoy. includes() method er kaj holo array er moddhe sei ObjectId ta ache kina ta check kora, ebong true ba 
     false return kora.

  3. jdi true return kore tahole user model er bookmark array theke post er id ta pull kore nebo, jdi false return kore tahole
     addToSet use korbo.

     $addToSet MongoDB er ekta operator, ja ekta array field er moddhe unique value add korar jonno use kora hoy. Er kaj holo 
     ensure kora je kono value array te ekbar matro add hobe, duplicate thakbe na. Jodi oi value already array te thake, tahole 
     seta abar add kora hoy na, mane duplicate avoid kora hoy.
   
*/



