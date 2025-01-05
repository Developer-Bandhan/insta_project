import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-fit my-10 pr-44'>
      <div className='flex items-center gap-2'>
        <Link to={`/home/profile/${user?._id}`}>
          <Avatar className='border border-gray-800'>
            <AvatarImage className='object-cover' src={user?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} alt='' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className='leading-none'>
          <h1 className='font-semibold text-sm'> <Link to={`/home/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className="text-gray-400 text-sm block w-32 truncate">
            {user?.bio || 'bio here'}
          </span>

        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar