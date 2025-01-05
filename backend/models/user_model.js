import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    storys:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, {timestamps: true});

export const User =  mongoose.model('User', userSchema);



/*  amra ekhane userschama create korlam, tarpor username, email, sob dilam, gender a enum use korechi, jokhon database a option dite hoy tokhon enum use kora hoy 
    
    ekhane followers add korbo, onek followers hote pare tai array er vetore rakhlam, followers er type a ' mongoose.Schema.Types.ObjectId ' r ' ref: "User" ' likhlam
    eta User model theke followers er objectid followers a store korbe, amra erokom korchi karon j follow korbe seo user e hobe tai onno user er ID store korbo jate amra
    user k jante pari, same following table er jonno o korbo 

    tarpor amra posts er jonno acta field korbo, jar type a ' mongoose.Schema.Types.ObjectId ' r ' ref: "Post" ' likhbo, user er kache onek post thakbe, sob post acta post table
    a thakbe r user er kache tar post gular ID thakbe, sei ID gulo diye amra user er post gulo khuje pabo.

    tarpor amra bookmarks (save) option banabo, jar modhe post er ID rakhbo, karon user onno kno user k bookmark kore na, kno post kei kore bookmark ei jonno user schema te bookmark 
    option a post er ID rakhbo, er theke bojha jbe user kon post k bookmark koreche
 
    tarpor amra {timestamps: true} korbo, eta korle user create howar time ta database a store hobe, 

    tarpor amra model create korbo, model r table er name same hoy (User) r model create korar jonno userSchema pass korte hobe 

 */