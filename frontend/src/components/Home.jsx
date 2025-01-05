import React from 'react'
import Feed from './Feed'
import Story from './Story'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import userGetSuggestedUsers from '@/hooks/useGetSuggestedUser'
// import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  userGetSuggestedUsers()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home