import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSeletetedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'


const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [openMsg, setOpenMsg] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes?.length || 0);
    const [comment, setComment] = useState(post.comments || []);
    const dispatch = useDispatch();



    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("")
        }

    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'; // Determine the action
            const res = await axios.get(`http://localhost:5000/api/v2/post/${post?._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                // Update the like count and liked state
                setPostLike(prev => liked ? prev - 1 : prev + 1);
                setLiked(prev => !prev);

                // Update the posts array
                const updatedPostData = posts.map(p =>
                    p?._id === post?._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter(id => id !== user?._id) // Remove like
                                : [...p.likes, user._id], // Add like
                        }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/v2/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });


            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p => {
                    if (p?._id === post?._id) {
                        return { ...p, comments: updatedCommentData };
                    }
                    return p;
                })

                dispatch(setPosts(updatedPostData));
                setText("");
                toast.success(res.data.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/v2/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id != post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.res.data.message);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v2/post/${post?._id}/bookmark`, {
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <Link to={`/home/profile/${user?._id}`}>
                    <div className='flex items-center gap-2'>
                        <Avatar>
                            <AvatarImage className='object-cover' src={post.author?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} alt='' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex items-center '>
                            <h1>{post.author?.username}</h1>
                            {
                                user?._id == post.author?._id && <Badge variant="secondary" className='bg-transparent text-white mt-[4px] hover:bg-transparent'>Author</Badge>
                            }

                        </div>
                    </div>
                </Link>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='w-[25rem] flex gap-0 bg-[#262626] p-0 overflow-hidden items-center border-none  text-white flex-col text-sm text-center'>
                        {
                            post?.author?._id !== user?._id &&  <Button variant='ghost' className='cursor-pointer border-b rounded-none py-7 hover:bg-[#1A1A1A] w-full hover:text-white border-zinc-600'>Unfollow</Button>
                        }
                       
                        <Button
                            variant='ghost'
                            className={`cursor-pointer ${user && user?._id == post?.author?._id ? 'border-b' : 'border-none'} rounded-none py-7 w-full hover:bg-[#1A1A1A] hover:text-white border-zinc-600`}
                        >Add to favorites</Button>
                        {
                            user && user?._id == post?.author?._id && <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer rounded-none py-7 w-full hover:bg-[#1A1A1A] hover:text-white '>Delete</Button>
                        }

                    </DialogContent>
                </Dialog>
            </div>
            <div className='overflow-hidden mt-3 bg-black'>
                <img
                    className='rounded-sm my-2 w-full  aspect-square object-contain'
                    src={post?.image}
                    alt="post_image"
                />
            </div>
            <div>
                <div className='flex justify-between items-center mt-3 mb-2'>
                    <div className='flex items-center gap-3'>
                        {
                            liked ? <FaHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                        }

                        <MessageCircle onClick={() => {
                            setOpenMsg(true);
                            dispatch(setSeletetedPost(post))
                        }} className='cursor-pointer hover:text-gray-600' />

                        <Send className='cursor-pointer hover:text-gray-600' />
                    </div>
                    <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
                </div>
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p className=''>
                <span className='font-medium mr-2'>{post?.author?.username}</span>
                {post?.caption}
            </p>
            {
                comment.length > 0 && <span onClick={() => {
                    dispatch(setSeletetedPost(post))
                    setOpenMsg(true);
                }
                } className='cursor-pointer text-gray-400'>View all {comment.length} comments</span>
            }


            <CommentDialog openMsg={openMsg} setOpenMsg={setOpenMsg} />
            <div className='flex justify-between items-center'>
                <input
                    type='text'
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none textsm w-full bg-zinc-950 text-white'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3badf8] cursor-pointer'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post


{/*
    
1. DialogTrigger ekta prebuilt component, jeta Dialog ke open ba close korar kaaj kore.
   Jodi asChild property set thake (mane true), tahole DialogTrigger nijer ekta DOM element 
   create kore na, barong tar children component (ei khetre <MoreHorizontal />) ke directly render kore.

2. এই কোডটি একটি React ইভেন্ট হ্যান্ডলার ফাংশন, যা ইনপুট ফিল্ডে ইউজারের দেওয়া মান (text) হ্যান্ডেল করার জন্য ব্যবহৃত হয়। 
   changeEventHandler ফাংশনটি e (ইভেন্ট অবজেক্ট) গ্রহণ করে, যেখানে e.target.value এর মাধ্যমে ইনপুটের মান নেওয়া হয় এবং 
   সেটি inputText ভেরিয়েবলে সংরক্ষণ করা হয়। এরপর, একটি শর্ত চেক করা হয়—যদি ইনপুট মানটি খালি স্পেস বাদে অন্য কিছু থাকে 
   (inputText.trim()), তবে setText(inputText) কল করে সেই মানটি সংরক্ষণ করা হয়। অন্যথায়, ইনপুটটি খালি থাকলে setText("") 
   কল করে text মানটি খালি স্ট্রিং এ রিসেট করা হয়। এই ফাংশনটি ইনপুট ফিল্ডের মানকে রিয়েল-টাইমে আপডেট করতে সাহায্য করে 
   এবং খালি ইনপুট এড়াতে কাজ করে।
ex:    
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        } else {
            setText("")
        }

    }






*/}