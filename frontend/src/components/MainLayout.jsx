import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

export const MainLayout = () => {
  return (
    <div className='w-full'>
      <LeftSidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}
