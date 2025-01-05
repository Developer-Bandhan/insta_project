import React, { useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Button } from './ui/button'
import { Heart, MessageCircle } from 'lucide-react'

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setactiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);
  console.log(userProfile?.profilePicture);
  const isLoggedinUser =  user?._id == userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setactiveTab(tab);
  };

  let displayedPost;
  if (activeTab == 'posts') {
    displayedPost = userProfile?.posts;
  } else if (activeTab == 'saved') {
    displayedPost = userProfile?.bookmarks;
  }
  return (
    <div className='flex max-w-6xl justify-center ml-[20%] pl-10 '>
      <div className='flex flex-col gap-20 p-10'>
        <div className='flex gap-24 ml-20'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-40 w-40 border border-gray-800'>
              <AvatarImage className='object-cover' src={userProfile?.profilePicture || 'https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg'} alt="profilePhoto" />
              <AvatarFallback>Cn</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-4'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedinUser ? (
                    <div className='flex gap-5'>
                     <Link to='/home/account/edit'><Button className='h-8 bg-[#393939] hover:bg-[#262626]'>Edit profile</Button></Link>
                      <Button className='h-8 bg-[#393939] hover:bg-[#262626]'>View archive</Button>
                      {/* <Button className='h-8 bg-[#393939] hover:bg-[#262626]'>Add tools</Button> */}
                    </div>
                  ) : (
                    isFollowing ? (
                      <div className='flex gap-5'>
                        <Button className='h-8 bg-[#393939] hover:bg-[#262626]'>Unfollow</Button>
                        <Button className='h-8 bg-[#393939] hover:bg-[#262626]'>Message</Button>
                      </div>
                    ) : (
                      <div className='flex gap-5'>
                        <Button className='h-8 bg-[#32a7f4] hover:bg-[#0095F6]'>Follow</Button>
                        <Button className='h-8 bg-[#393939] hover:bg-[#262626]'>Message</Button>
                      </div>
                    )

                  )
                }

              </div>
              <div className='flex items-center gap-6'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span> posts</p>
                <p> <span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className=' text-sm w-40 flex flex-col'>
                <pre>{userProfile?.bio || 'bio here...'}</pre>
                
              </div>

            </div>
          </section>
        </div>
        <div className='border-t mr-8 border-zinc-800 w-[65vw]'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span onClick={() => setactiveTab('posts')} className={`py-3 cursor-pointer ${activeTab == 'posts' ? 'text-white' : 'text-zinc-500'}`}>POSTS</span>
            <span onClick={() => setactiveTab('reels')} className={`py-3 cursor-pointer ${activeTab == 'reels' ? 'text-white' : 'text-zinc-500'}`}>REELS</span>
            <span onClick={() => setactiveTab('saved')} className={`py-3 cursor-pointer  ${activeTab == 'saved' ? 'text-white' : 'text-zinc-500'}`}>SAVED</span>
            <span onClick={() => setactiveTab('tagged')} className={`py-3 cursor-pointer ${activeTab == 'tagged' ? 'text-white' : 'text-zinc-500'}`}>TAGGED</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post?.image} alt="post_img" className=' my-2 w-full aspect-square object-contain' />
                    <div className='inset-0 absolute flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-800'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-800'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile