import { setMessages } from "@/redux/chatSlice"
import { setPosts } from "@/redux/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v2/message/all/${selectedUser?._id}`, {
                     withCredentials: true
                })
                if(res.data.success) {
                    // console.log(res.data);
                    dispatch(setMessages(res.data.messages));
                }

            } catch (error) {
                
            }
        }
        fetchAllMessage();

    }, [selectedUser]);
}

export default useGetAllMessage;