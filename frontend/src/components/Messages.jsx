import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import UseGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    UseGetRTM()
    useGetAllMessage()
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col justify-center items-center'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold text-lg'>{selectedUser?.username}</span>
                    <Link to={`/home/profile/${selectedUser?._id}`}><Button className='h-8 my-4  bg-[#393939] hover:bg-[#262626]'>View profile</Button></Link>
                </div>
            </div>
            <div className='flex px-1 flex-col gap-3 '>
                {
                    messages && messages.map((msg) => {
                        return (

                            msg.senderId == user?._id ? (
                                <div className={`flex ${msg.senderId == user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`py-2 px-4 rounded-full max-w-xs break-words ${msg.senderId == user?._id ? 'bg-[#3797F0]' : 'bg-[#262626]'}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-2 ${msg.senderId == user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <Avatar className='w-8 h-8 '>
                                        <AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className={`py-2 px-4 rounded-full max-w-xs break-words ${msg.senderId == user?._id ? 'bg-[#3797F0]' : 'bg-[#262626]'}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            )

                            // <div className={`flex ${msg.senderId == user?._id ? 'justify-end' : 'justify-start'}`}>
                            //     <div className={`py-2 px-4 rounded-full max-w-xs break-words ${msg.senderId == user?._id ? 'bg-[#3797F0]' : 'bg-[#262626]'}`}>
                            //         {msg.message}
                            //     </div>
                            // </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages