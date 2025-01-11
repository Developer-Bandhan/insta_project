import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils.js';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imgRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {posts} = useSelector(store => store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImgPreview(dataUrl);
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (imgPreview) formData.append('image', file);
    try {
      setLoading(true);
      const res = await axios.post('https://instagram-project-ogve.onrender.com/api/v2/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message);
        setOpen(false);
        setFile('');
        setCaption('');
        setImgPreview('');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => setOpen(false)} className='bg-[#262626] border-none text-white'>
        <DialogHeader className='text-center font-medium'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage className='object-cover' src={user?.profilePicture} alt='img' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-sm'>{user?.username}</h1>
            {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}

          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder="Write a caption..." />
        {
          imgPreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img className='object-contain h-full w-full rounded-md' src={imgPreview} alt="Preview_img" />
            </div>
          )
        }
        <input ref={imgRef} type='file' className='hidden' onChange={fileChangeHandler} />
        {
          <Button onClick={() => imgRef.current.click()} className="w-fit mx-auto rounded-lg bg-[#0095f6] hover:bg-[#1877F2]">{imgPreview? 'Change image' : 'Select from computer' }</Button>
        }
        {
          imgPreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait...
              </Button>
            ) : (
              <Button onClick={createPostHandler} type='submit' className='w-full'>Post</Button>
            )
          )
        }

      </DialogContent>
    </Dialog>
  )
}

export default CreatePost