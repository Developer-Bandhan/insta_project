import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setselectedUser } from '@/redux/authSlice';
import { AiOutlineMessage } from "react-icons/ai";
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { BsEmojiSmile } from "react-icons/bs";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`https://instagram-project-ogve.onrender.com/api/v2/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
                setShowEmoji(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addEmoji = (e) => {
        const sym = e.unified.split("_");
        const codeArray = [];
        sym.forEach((el) => codeArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codeArray);
        setTextMessage(textMessage + emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.emoji-picker') && !event.target.closest('.emoji-trigger')) {
                setShowEmoji(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return () => {
            dispatch(setselectedUser(null));
        };
    }, []);

    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-[20vw] border-r border-zinc-800'>
                <div className='py-[22px] border-b border-zinc-800'>
                    <h1 className='font-bold text-xl pl-2'>{user?.username}</h1>
                </div>
                <div className='overflow-y-auto  h-[80vh] '>
                    <span className='pl-2'>Messages</span>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);

                        return (
                            <div
                                key={suggestedUser?._id}
                                onClick={() => dispatch(setselectedUser(suggestedUser))}
                                className='flex gap-3 items-center p-3 hover:bg-[#121212] cursor-pointer'
                            >
                                <Avatar className='relative w-12 h-12'>
                                    <AvatarImage className='object-cover' src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {isOnline && (
                                    <div className='absolute bg-black ml-8 flex items-center justify-center mt-8 h-4 w-4 rounded-full'>
                                        <span className='w-3 h-3 rounded-full bg-green-600'></span>
                                    </div>
                                )}
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-semibold text-zinc-400`}>
                                        {isOnline ? 'Active now' : 'offline'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className='flex-1 border-l border-zinc-800 flex flex-col h-full'>
                    <div className='flex gap-3 items-center px-3 py-4 border-b border-zinc-800 sticky top-0 bg-black z-10'>
                        <Avatar className='relative'>
                            <AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {onlineUsers.includes(selectedUser?._id) && (
                            <div className='absolute bg-black ml-7 flex items-center justify-center mt-6 h-4 w-4 rounded-full'>
                                <span className='w-3 h-3 rounded-full bg-green-600'></span>
                            </div>
                        )}
                        <div className='flex flex-col'>
                            <span>{selectedUser?.username}</span>
                            <span className='text-xs text-zinc-400'>
                                {onlineUsers.includes(selectedUser?._id) ? 'Active now' : 'offline'}
                            </span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className='flex items-center p-4 border-t-zinc-800'>
                        <div className='relative border flex w-full items-center px-3 rounded-full border-zinc-600'>
                            {showEmoji && (
                                <div className='absolute bottom-[100%] left-2 emoji-picker'>
                                    <Picker
                                        emojiSize={20}
                                        data={data}
                                        onEmojiSelect={addEmoji}
                                    />
                                </div>
                            )}
                            <span
                                onClick={() => setShowEmoji(!showEmoji)}
                                className='text-2xl font-bold mr-1 cursor-pointer emoji-trigger'
                            >
                                <BsEmojiSmile />
                            </span>
                            <input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                type='text'
                                className='w-full p-2 focus:ring-0 focus:outline-none bg-transparent'
                                placeholder='Messages...'
                            />
                            <span
                                onClick={() => sendMessageHandler(selectedUser?._id)}
                                className='text-[#4d96f7] cursor-pointer'
                            >
                                Send
                            </span>
                        </div>
                    </div>
                </section>
            ) : (
                <div className='flex flex-col items-center justify-center mx-auto'>
                    <div className='w-24 h-24 border-[2px] border-zinc-50 flex items-center justify-center rounded-full'>
                        <AiOutlineMessage className='w-10 h-10' />
                    </div>
                    <h1 className='font-semibold text-xl'>Your messages</h1>
                    <span className='text-sm text-zinc-400'>
                        send a message to start a chat
                    </span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
