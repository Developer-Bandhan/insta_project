import React, { useEffect, useState } from 'react'
import instaimg from '../assets/Instagram-Wordmark-White-Logo.wine.png';
import { Label } from './ui/label';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice.js';



const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();




    const changeEventHandler = (e) => {
        console.log(e.target)
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:5000/api/v2/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate('/home');
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                })
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if(user){
           navigate('/home')
        }
    },[])

    return (
        <div className='flex bg-zinc-950 items-center justify-center w-screen h-screen'>
            <form onSubmit={signupHandler} className='sm:w-[23rem] sm:h-[28rem] w-full mb-20 px-3 sm:px-0 text-white' >
            <div className='w-full h-full sm:w-full sm:h-[95%] sm:border sm:border-zinc-800 border-0'>
                    <div className='w-full flex items-center justify-center flex-col'>
                        <img className='w-[12rem]' src={instaimg} alt="" />
                    </div>
                    <div className='mx-7 mt-5 flex flex-col'>
                        <Label>Email</Label>
                        <input
                            type="email"
                            name='email'
                            value={input.email}
                            onChange={changeEventHandler}
                            className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-sm p-[7px]'
                        />
                    </div>
                    <div className='mx-7 mt-5 flex flex-col'>
                        <Label>Password</Label>
                        <input
                            type="password"
                            name='password'
                            value={input.password}
                            onChange={changeEventHandler}
                            className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-sm p-[7px]'
                        />
                    </div>
                    {
                        loading ? (
                            <div className=' mx-7 mt-16 sm:mt-5 flex justify-center '>
                                <Button className='bg-[#4d97f8] w-full hover:bg-[#1877F2]'>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            </div>
                        ) : (
                            <div className=' mx-7 mt-16 sm:mt-5 flex justify-center '>
                                <Button type="submit" className='bg-[#4d97f8] w-full hover:bg-[#1877F2]'>Log in</Button>
                            </div>
                        )
                    }


                </div>
                <div className=" w-full h-[4rem] bg-zinc-950 border-0 sm:border sm:border-zinc-800 mt-3 flex items-center justify-center">
                    <p>Don't have an account? <Link to="/signup" className='text-blue-500'>Sign up</Link></p>
                </div>

            </form>
        </div>
    )
}

export default Login

{/*
   1. dispatch(setAuthUser(res.data.user));

      dispatch: In this code, useDispatch React Redux-এর একটি হুক যা dispatch ফাংশন সরবরাহ করে, যা Redux স্টোরে action পাঠানোর জন্য ব্যবহৃত হয়। 
      dispatch(setAuthUser(res.data.user)) লাইনে, setAuthUser একটি action creator যা res.data.user (সম্ভবত API response থেকে প্রাপ্ত user data) কে 
      প্যারামিটার হিসেবে গ্রহণ করে। এই action Redux স্টোরে পাঠানো হয়, যেখানে সংশ্লিষ্ট reducer স্টেট আপডেট করে নতুন user information দিয়ে। এই প্রক্রিয়াটি 
      নিশ্চিত করে যে authentication সম্পর্কিত ডেটা global state-এ আপডেট হয় এবং অ্যাপ্লিকেশনের যেকোনো অংশ থেকে সহজে অ্যাক্সেস করা যায়।


    
      
    
    
    
    
    */}