import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ''
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

export const Post = mongoose.model('Post', postSchema);


/* 
   prothome amra caption rakhbo, tarpor image.

   tarpor amra author rakhbo, auther a user er ID store korbo, author ei jonno rakhbo karon ei post ta k create koreche ta janar jonno 

   tarpor likes, like onek hote pare tai like array akare store korbo, like a kon user like koreche seta store korbo

   tarpor comments, ekhane comments er jonno userID store korbo, karon ei post a kon user comment koreche eta janar jonno,
   amra comments er jonno alada schema banabo karon comments a onek kichu thake, jemon comment_time, comment_user, comment_text etc,
   tai er jonno alada models create korte hobe

*/

