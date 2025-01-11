import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { setLikeNotification } from '../redux/rtnSlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import instaimg from '../assets/Instagram-Wordmark-White-Logo.wine.png';
import { Compass, Heart, Home, LogOut, MessageCircleMore, Search, SquarePlay, SquarePlus } from 'lucide-react';
import CreatePost from './CreatePost';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthUser } from '@/redux/authSlice';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { likeNotification } = useSelector((store) => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false); // State to track popover open/close

    const logoutRouter = async () => {
        try {
            const res = await axios.get('https://instagram-project-ogve.onrender.com/api/v2/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (text) => {
        if (text === 'Home') {
            navigate('/home');
        } else if (text === 'Logout') {
            logoutRouter();
        } else if (text === 'Create') {
            setOpen(true);
        } else if (text === 'Profile') {
            navigate(`/home/profile/${user?._id}`);
        } else if (text === 'Messages') {
            navigate(`/home/chat`);
        }
    };

    const handleNotificationClick = () => {
        dispatch(setLikeNotification({ type: 'reset' })); // Clear notifications after viewing
    };

    const sidebarItems = [
        { icon: <Home />, text: 'Home' },
        { icon: <Search />, text: 'Search' },
        { icon: <Compass />, text: 'Explore' },
        { icon: <SquarePlay />, text: 'Reels' },
        { icon: <MessageCircleMore />, text: 'Messages' },
        { icon: <Heart />, text: 'Notifications' },
        { icon: <SquarePlus />, text: 'Create' },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage
                        className="object-cover"
                        src={
                            user?.profilePicture ||
                            'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'
                        }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: 'Profile',
        },
        { icon: <LogOut />, text: 'Logout' },
    ];

    return (
        <div className="fixed top-0 z-10 left-0 bg-zinc-950 px-4 border-r border-[#1A1A1A] w-[16%] h-screen">
            <div className="flex flex-col">
                <img className="w-[8.5rem] pt-2 hidden lg:block" src={instaimg} alt="" />
                <div>
                    {sidebarItems.map((item, index) => {
                        return item.text === 'Notifications' && likeNotification.length > 0 ? (
                            <Popover
                                key={index}
                                open={popoverOpen} // Control popover open/close
                                onOpenChange={(isOpen) => {
                                    setPopoverOpen(isOpen); // Update popover state
                                    if (!isOpen) {
                                        setTimeout(handleNotificationClick, -100); // Call after the popover closes
                                    }
                                }} // Set state on popover open/close
                            >
                                <PopoverTrigger asChild>
                                    <div
                                        className="flex items-center gap-3 relative hover:bg-[#1A1A1A] cursor-pointer rounded-lg p-3 my-1"
                                    >
                                        {item.icon}
                                        <span className="hidden lg:block">{item.text}</span>
                                        <Button
                                            size="icon"
                                            className="rounded-full text-sm h-5 w-5 absolute bottom-6 left-6 bg-[#FF3040] hover:bg-[#FF3040]"
                                        >
                                            {likeNotification.length}
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="bg-[#363636] border-none text-white ml-7">
                                    <div>
                                        {likeNotification.map((notification) => (
                                            <div key={notification.userId} className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={notification?.userDetails?.profilePicture} />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className="text-sm">
                                                    <span className="font-bold">{notification.userDetails?.username} </span>
                                                    liked your post
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className={`flex items-center gap-3 relative hover:bg-[#1A1A1A] cursor-pointer rounded-lg p-3 my-1 ${
                                    item.text === 'Logout' ? 'mt-28' : ''
                                }`}
                            >
                                {item.icon}
                                <span className="hidden lg:block">{item.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;















// import { Compass, Heart, Home, LogOut, MessageCircleMore, Search, SquarePlay, SquarePlus } from 'lucide-react'
// import React, { useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import instaimg from '../assets/Instagram-Wordmark-White-Logo.wine.png';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { setAuthUser } from '@/redux/authSlice';
// import CreatePost from './CreatePost';
// import { setPosts, setSeletetedPost } from '@/redux/postSlice';
// import store from '@/redux/store';
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
// import { Button } from './ui/button';


// const LeftSidebar = () => {

//     const navigate = useNavigate();
//     const { user } = useSelector(store => store.auth);
//     const { likeNotification } = useSelector(store => store.realTimeNotification);
//     const dispatch = useDispatch();
//     const [open, setOpen] = useState(false);




//     const logoutRouter = async () => {
//         try {
//             const res = await axios.get('http://localhost:5000/api/v2/user/logout', { withCredentials: true })
//             if (res.data.success) {
//                 dispatch(setAuthUser(null));
//                 navigate('/login');
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             toast.error(error.response.data.message);
//         }
//     }
//     const sidebarHandler = (text) => {
//         if (text == 'Home') {
//             navigate('/home')
//         } else if (text == 'Logout') {
//             logoutRouter();
//         } else if (text == 'Create') {
//             setOpen(true);
//         } else if (text == 'Profile') {
//             navigate(`/home/profile/${user?._id}`);
//         } else if (text == 'Messages') {
//             navigate(`/home/chat`);
//         }
//     }

//     const sidebarItems = [
//         { icon: <Home />, text: "Home" },
//         { icon: <Search />, text: "Search" },
//         { icon: <Compass />, text: "Explore" },
//         { icon: <SquarePlay />, text: "Reels" },
//         { icon: <MessageCircleMore />, text: "Messages" },
//         { icon: <Heart />, text: "Notifications" },
//         { icon: <SquarePlus />, text: "Create" },
//         {
//             icon: (
//                 <Avatar className='w-6 h-6'>
//                     <AvatarImage src={user?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} />
//                     <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//             ), text: "Profile"
//         },
//         { icon: <LogOut />, text: "Logout" },
//     ]


//     return (
//         <div className={'fixed top-0 z-10 left-0 bg-zinc-950 px-4 border-r border-[#1A1A1A] w-[16%] h-screen'}>
//             <div className='flex flex-col'>
//                 <img className='w-[8.5rem] pt-2 hidden lg:block' src={instaimg} alt="" />
//                 <div>
//                     {
//                         sidebarItems.map((item, index) => {
//                             return (
//                                 <div onClick={() => sidebarHandler(item.text)} key={index} className={`flex items-center gap-3 relative hover:bg-[#1A1A1A] cursor-pointer rounded-lg p-3 my-1 ${item.text == 'Logout' ? 'mt-28' : ''} `}>
//                                     {item.icon}
//                                     <span className='hidden lg:block'>{item.text}</span>
//                                     {
//                                         item.text == 'Notifications' && likeNotification.length > 0 && (
//                                             <Popover>
//                                                 <PopoverTrigger asChild>
//                                                    
//                                                     <Button size='icon' className='rounded-full text-sm h-5 w-5 absolute hover: bottom-6 left-6 bg-[#FF3040] hover:bg-[#FF3040]'>{likeNotification.length}</Button>
//                                                    
//                                                 </PopoverTrigger>
//                                                 <PopoverContent className='bg-[#363636] border-none text-white ml-7'>
//                                                     <div>
//                                                         {
//                                                             likeNotification.length == 0 ? (
//                                                                 ''
//                                                             ) : (
//                                                                 likeNotification.map((notification) => {
//                                                                     return (
//                                                                         <div key={notification.userId} className='flex items-center gap-2'>
//                                                                             <Avatar>
//                                                                                 <AvatarImage src={notification?.userDetails?.profilePicture} />
//                                                                                 <AvatarFallback>CN</AvatarFallback>
//                                                                             </Avatar>
//                                                                             <p className='text-sm '><span className='font-bold'>{notification.userDetails?.username} </span>liked user post</p>
//                                                                         </div>
//                                                                     )
//                                                                 })
//                                                             )
//                                                         }
//                                                     </div>
//                                                 </PopoverContent>
//                                             </Popover>
//                                         )
//                                     }
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//             </div>

//             <CreatePost open={open} setOpen={setOpen} />

//         </div>
//     )
// }

// export default LeftSidebar

// {/*  
//     1. profile picture a dp dekhanor jonno, shadcnUI theke avatar install korbo, tarpor use korbo
//        eta profile picture er moto shape debe, tarpor code copy paste kore, avater, avatarimage r avatarfallback 
//        import kore note hobe. 
    
//     2. erokom onClick a kno kichu pathate gele tahole colback function use korte hoy 
//        ex: onClick={() => sidebarHandler(item.text)}

    
//     3. এই কোডে, useSelector React Redux-এর একটি হুক যা Redux স্টোরের state অ্যাক্সেস করার জন্য ব্যবহৃত হয়। store => store.auth 
//        অংশটি নির্দেশ করে যে আমরা state-এর auth অংশে অ্যাক্সেস করছি এবং সেখান থেকে user অবজেক্টটি destructure করছি। যদি user 
//        উপস্থিত থাকে, তাহলে optional chaining (user?.profilePicture) ব্যবহার করে profilePicture প্রপার্টি অ্যাক্সেস করা হচ্ছে। এটি 
//        নিশ্চিত করে যে, যদি user null বা undefined হয়, তবুও কোনো এরর হবে না। এরপর <AvatarImage> কম্পোনেন্টটি user?.profilePicture-কে 
//        src প্রপ হিসেবে গ্রহণ করে এবং ব্যবহারকারীর প্রোফাইল ছবি প্রদর্শন করে। এটি Redux স্টোরের state অনুযায়ী ডায়নামিকভাবে avatar রেন্ডার করতে সাহায্য করে।
      
//      const { user } = useSelector(store => store.auth);
//       <AvatarImage src={user?.profilePicture} />


//     4. logout korle store theke user k dispatched korte hobe, mane delete korte hobe, 
//         dispatch(setAuthUser(null));



    
//     */}