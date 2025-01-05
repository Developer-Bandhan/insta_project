import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
    ],
    messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message'
        }
    ],
})


export const Conversation = mongoose.model('Conversation', conversationSchema);




/*
  conversationSchema te participants rakhte hobe, kader modhe conversation cholche seta store korar jonno, 
  eta array akare define korbo, karon single manuser modhe conversation hole setate akta person thakbe kintu group 
  chat hole onek thakbe tai, array akare define korte hobe
  participants er madhome amra deside korte parbo ei user gulor modhe chat amake display korte hobe,


  acta msg field o thakbe karon duto persion er modhe ki msg hoyeche setao store korte hobe, etate massege table theke
  msgId store korbo, jate msg collection(table) theke msgId er madhome specific user er msg khuje pawa jay 



*/