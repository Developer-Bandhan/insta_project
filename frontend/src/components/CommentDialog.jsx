import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ openMsg, setOpenMsg }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if(selectedPost){
            setComment(selectedPost.comments)
        }
    }, [selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }

    }
    
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://instagram-project-ogve.onrender.com/api/v2/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });


            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p => {
                  
                    // p._id == selectedPost._id ? {...p, comments: updatedCommentData} : p

                    if (p._id === selectedPost._id) {
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


    return (
        <Dialog open={openMsg} className='rounded-none '>
            <DialogContent onInteractOutside={() => setOpenMsg(false)} className='p-0 rounded-none max-w-5xl border-0'>
                <div className='flex flex-1' border-0>
                    <div className='w-1/2 max-h-[90vh] min-h-[60vh] border-0 bg-black'>
                        <img
                            src={selectedPost?.image}
                            alt="post_image"
                            className='w-full h-full object-contain '
                        />
                    </div>
                    <div className='w-1/2 flex flex-col bg-zinc-950 text-white justify-between'>
                        <div className='flex items-center border-b border-zinc-700 justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage className='object-cover' src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='flex flex-col'>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                    {/* <span className='textgra'>bio here...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className='w-[25rem] flex gap-0 bg-[#262626] p-0 overflow-hidden items-center border-none  text-white flex-col text-sm text-center'>
                                    <Button variant='ghost' className='cursor-pointer border-b rounded-none py-7 hover:bg-[#1A1A1A] w-full hover:text-white border-zinc-600'>Unfollow</Button>
                                    <Button variant='ghost' className='cursor-pointer border-b rounded-none py-7 w-full hover:bg-[#1A1A1A] hover:text-white border-zinc-600'>Add to favorites</Button>
                                    <Button variant='ghost' className='cursor-pointer rounded-none py-7 w-full hover:bg-[#1A1A1A] hover:text-white '>Cancle</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className='flex-1 overflow-y-auto max-h-96 px-4'>
                            {
                                // selectedPost?.comments.map((comment) => <Comment key={comment._id} comment={comment} />)
                                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex justify-between items-center'>
                                <input
                                    type='text'
                                    placeholder='Add a comment...'
                                    value={text}
                                    onChange={changeEventHandler}
                                    className='outline-none text-sm w-full bg-zinc-950 text-white'
                                />

                                <span onClick={sendMessageHandler} className={` ${text ? 'opacity-100' : 'opacity-50'} text-[#3badf8] cursor-pointer`}>Post</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog


{/* 
    1. commentDailog post er message icon a click korle open hobe, etar jonno amader post.jsx a acta 
       useState hook nite hobe, const [openMsg, setOpenMsg] = useState(false); tarpor eta MessageIcon
       a call korbo onClick er madhome, tarpor setOpenMsg er valur true kore debo, ex: <MessageCircle onClick={() => setOpenMsg(true)}
       tarpor CommentDialog.jsx decleare korar somoy openMsg r setOpenMsg as a props pathiye debo, 
       ex: <CommentDialog openMsg={openMsg} setOpenMsg={setOpenMsg}/>
       tarpor egula commentDialog a nebo, destructure er madhome, ex: const CommentDialog = ({ openMsg, setOpenMsg }) => {
       bairer screen a click korle commentDialog jate close hoye jay tar jonno ei function ta use korbo
       ex: <DialogContent onInteractOutside={() => setOpenMsg(false)}
    
    
    
    */}