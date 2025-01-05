import { Conversation } from "../models/conversation_model.js";
import { Message } from "../models/message_model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage:message } = req.body;
        // console.log(message);

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });

        // establish the conversation if not started...
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            });
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()])
 
        // implement socket.IO for realtime data transfer... one to one
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }
        

        return res.status(201).json({
            success: true,
            newMessage
        })

        
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages')
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages})
        
    } catch (error) {
        console.log(error);
    }
}


/* --- getMessage ---
  
  1. prothome senderID req.id theke neho, sender sei hobe j logedInUser hobe, tarpor req.params.id theke
     receiverId niye nebo.

  2. tarpro senderId r receiverId diye conversation find korbo. tarpor check korbo, jdi conversation na thake
     tahole message a khali array [] send korbo

  3. tarpor responce return korbo, sathe message a conversation.message send korbo. conversation acta ob

*/














/* --- sentMessage ---
  
  1. prothome senderId req.id theke nebo, j logedInUser hobe sei message send korbe tai req.id theke senderId nebo.
     tarpor receiverId store korbo req.params.id theke jeta frantend theke parameter theke asbe, sender jar chat ta khulbe 
     tar id url a jbe, etar madhone amra req.params.id theke store korbo. tarpor req.body theke message destructure kore 
     nebo, destructure korar jonno { message } erokom likhte hoy. req.body te frantend theke asa data thakbe.

  2. tarpor conversation find korbo, 
     
     let conversation = await Conversation.findOne({
            participants:{$all:{senderId, receiverId}}
        })

        let conversation = await Conversation.findOne({ participants: { $all: { senderId, receiverId } } });
        ei line er kaj holo, database theke ekta conversation khuje ber kora jekhane dujon user (senderId r receiverId) 
        er ID participants field er modhye ache. Ei process ke amra ekta query boli, jeta MongoDB er $all operator diye 
        banano hoyeche.

        Ei query er madhome amra check korchi je sender r receiver er modhye age theke kono conversation ache kina. Jodi 
        ache, tahole sei conversation object ta return korbe.

        MongoDB-te $all operator array field-er modhye specific multiple values search korar jonne use hoy. Eta bole je 
        array-te query-te deya shob value thakte hobe, kintu oi value-gulo kono specific order-e ba position-e thaka lagbe 
        na. For example, jodi participants array-te senderId r receiverId thake, tahole $all use kore check kora jay je oi 
        duita value sei array-te ache kina. Eta useful, jokhon amra ensure korte chai je ekta array-te ek shomoy-e onek gulo 
        value thakte hobe, irrespective of order. $all operator er syntax hocche { field: { $all: [value1, value2] } }, mane 
        array field er shathe $all er shubidha niye specific values gulo match kora jay.

        Amra chaichi je ekta user dujoner modhye conversation er data efficiently manage korte. Jodi age theke ekta conversation 
        thake, tahole notun kore create na kore oi conversation e message add kora hobe. Eta system ke optimized r fast rakhe.


   3. tarpor conversation estrablished korbo, 
      Ekhane check kora hocche je conversation ache kina. Jodi conversation na thake (!conversation), tahole Conversation.create 
      diye notun ekta conversation banano hocche. Ei conversation-er participants array-te senderId r receiverId store kora hocche, 
      mane kon sender r receiver-er moddhe ei conversation ta hobe ta mention kora hocche.

   4. const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });
      
      senderId: Kon user ei message ta pathalo.
      receiverId: Kon user ei message ta pabe.
      message: Actual message content, ja user likheche.
      Eta database-e notun ekta entry create kore jekhane message related shob information thakbe.

   5. if (newMessage) conversation.messages.push(newMessage._id);
     
       Jodi newMessage successfully create hoy, tahole ei message-er unique ID (_id) ta conversation.messages array-te push kora hocche.
       Eta bole je ei message kon conversation-er under-e stored hobe.
       messages array modhye conversation related sob message-id track kora hoy.

   6. await Promise.all([conversation.save(), newMessage.save()]);
      
        Ekhane Promise.all use kore ek shathe conversation r newMessage ke save kora hocche.
        conversation.save(): Update kora conversation database-e save kora hocche, ja messages array-te notun message er ID add kore.
        newMessage.save(): Message database-e save hoy, ja message related details store kore.
        Promise.all use korar karon holo, ek shathe duita async operation handle kora.


        In await Promise.all([conversation.save(), newMessage.save()]);, conversation.save() ar newMessage.save() duita asynchronous 
        operation ek sathe parallel bhabe run kore. Promise.all() duita promise complete howar jonno wait kore. Jodi duita save 
        operation successful hoy, tahole Promise.all() resolve hoye jai. Kintu, jodi kono ekta operation fail kore, tahole puro
        Promise.all() reject hoye jabe, jate duita conversation o new message successful vabe save hoye jae. await use kore function 
        er execution pause kora hoye, jate duita operation complete howar por ager step execute hoi.


*/