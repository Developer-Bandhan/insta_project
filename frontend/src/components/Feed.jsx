import React from 'react'
import Posts from './Posts'
import Storys from './Storys'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
      <Storys/>
        <Posts/>
    </div>
  )
}

export default Feed


{/* 

  feed hoche MailLayout er middle er part ekhane posts render kora hobe
  tarpor posts method a post render kora hobe, tarpor post a post create
  kora hobe
  
  
  
  */}