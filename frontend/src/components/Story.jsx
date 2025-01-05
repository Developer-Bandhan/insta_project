import React from 'react'

const Story = () => {
  return (
    <div className='flex justify-center flex-col items-center cursor-pointer'>
      <div className='bg-gradient-to-tr from-yellow-400 to-fuchsia-600 w-[4rem] h-[4rem] rounded-full flex items-center justify-center'>
        <div className='w-[3.7rem] h-[3.7rem] bg-black flex items-center justify-center rounded-full'>
          <div className='w-[3.5rem] h-[3.5rem] rounded-full overflow-hidden'>
            <img className='w-full h-full object-cover ' src="https://graphicsprings.com/wp-content/uploads/2024/09/dynamic-instagram-logo-design-with-an-engaging-vibrant-look.webp" alt="" />
          </div>
        </div>
      </div>
      <p className='text-sm'>userna...</p>
    </div>
  )
}

export default Story