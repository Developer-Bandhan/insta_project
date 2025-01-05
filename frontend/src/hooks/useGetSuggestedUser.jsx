import { setSuggestedUsers } from "@/redux/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const userGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const feachSuggestedUsers = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v2/user/suggested`, {
                     withCredentials: true
                })
                if(res.data.success) {
                    // console.log(res.data);
                    dispatch(setSuggestedUsers(res.data.users));
                }

            } catch (error) {
                
            }
        }
        feachSuggestedUsers();

    }, []);
}

export default userGetSuggestedUsers;