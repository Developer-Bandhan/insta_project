import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
})


export const Comment = mongoose.model('Comment', commentSchema);








/*
  comment schema te prothome text rakhbo

  tarpor author rakhbo, karon kon user comment koreche seta store korte hobe, author a user er ID store korbo 
  amra author required true korbo 

  tarpor post rakhbo, kon post a comment koreche seta store korte hobe, tai post ID store korbo, ref 'Post' thakbe, 


*/