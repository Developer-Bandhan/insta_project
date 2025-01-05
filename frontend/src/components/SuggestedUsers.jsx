import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const limitedSuggestedUsers = suggestedUsers.slice(0, 5);
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between gap-16 text-sm'>
                <h1 className='font-semibold text-gray-500'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                limitedSuggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className='flex items-center justify-between my-5'>

                            <div className='flex items-center gap-2'>
                                <Link to={`/home/profile/${user?._id}`}>
                                    <Avatar className='border border-gray-800'>
                                        <AvatarImage className='object-cover' src={user?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} alt='' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className='leading-none'>
                                    <h1 className='font-semibold text-sm'> <Link to={`/home/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-400 text-sm block w-32 truncate '>{user?.bio || 'bio here'}</span>
                                </div>
                            </div>
                            <span className='text-[#3badf8] text-xs font-bold cursor-pointer hover:text-[#3495d7]'>Follow</span>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers