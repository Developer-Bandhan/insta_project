import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
})

export const Message = mongoose.model('Message', messageSchema);


/* 
   messageSchema te amra senderId store korbo, tarpor receiverId store korbo, sathe msg store korbo

   protita msg k send korlo, senderId theke k send korlo seta bojha jbe, receiverId theke k receve korlo seta bojha jbe,


*/