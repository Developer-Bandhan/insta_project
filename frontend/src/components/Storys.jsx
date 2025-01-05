import React from 'react'
import Story from './Story'

const Storys = () => {
  return (
    <div className='scrollbar-hide w-[70%] overflow-x-auto flex items-center gap-4'>
        {
            [1,2,3,4,5,6,7,8,9,10].map((item, index) => <Story key={index}/>)
        }
    </div>
  )
}

export default Storys