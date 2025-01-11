import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const EditProfile = () => {
    const imgRef = useRef();
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }
    const changeBioHandler = (e) => {
        setInput({ ...input, bio: e.target.value });
    }

    const editProfileHandler = async () => {
        // console.log(input);
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto){
            formData.append("profilePhoto", input.profilePhoto);
        }

        try {
            setLoading(true);
            const res = await axios.post('https://instagram-project-ogve.onrender.com/api/v2/user/profile/edit', formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                }
                dispatch(setAuthUser(updatedUserData));
                navigate(`/home/profile/${user?._id}`);
                toast.success(res.data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto mt-10 pl-10'>
            <section className='flex flex-col gap-6 w-full'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-[#262626] rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='border w-14 h-14 border-gray-600'>
                            <AvatarImage className='object-cover' src={user?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} alt='' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='leading-none'>
                            <h1 className='text-sm font-bold'>{user?.username}</h1>
                            {/* <pre className='text-gray-400 text-sm'>{user?.bio || 'bio here'}</pre> */}
                        </div>
                    </div>
                    <input ref={imgRef}  onChange={fileChangeHandler} type="file" className='hidden' />
                    <Button onClick={() => imgRef?.current.click()} className=' bg-[#32a7f4] hover:bg-[#0095F6]'>Change Photo</Button>
                </div>
                <div>
                    <h1 className='font-semibold'>Bio</h1>
                    <Textarea value={input.bio} onChange={changeBioHandler} placeholder="Bio" className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-xl px-3' />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler} className="bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2  mt-3 text-gray-300 rounded-xl px-4  shadow-md">
                        <SelectTrigger className="flex items-center bg-[#09090B] hover:bg-[#1A1A1A] border border-zinc-700 focus:outline-none focus:ring-2  rounded-xl px-4 py-6">
                            <SelectValue className="text-zinc-600" />
                        </SelectTrigger>
                        <SelectContent className="border border-zinc-700 bg-zinc-900 shadow-lg rounded-xl overflow-hidden mt-2">
                            <SelectGroup>
                                <SelectItem
                                    value="male"
                                    className=" py-2 focus:bg-[#262626] focus:text-white text-white cursor-pointer"
                                >
                                    Male
                                </SelectItem>
                                <SelectItem
                                    value="female"
                                    className=" py-2 focus:bg-[#262626] focus:text-white text-white cursor-pointer"
                                >
                                    Female
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className='text-xs my-1 mx-2 text-zinc-500'>This won't be part of your public profile.</p>


                </div>
                <div className='flex w-full justify-end mt-16 '>
                    {
                        loading ? (
                            <Button className='px-24 py-5 bg-[#32a7f4] hover:bg-[#0095F6]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} className='px-24 py-5 bg-[#32a7f4] hover:bg-[#0095F6]'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile