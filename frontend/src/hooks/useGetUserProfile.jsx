import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v2/user/${userId}/profile`, {
                     withCredentials: true
                })
                if(res.data.success) {
                    // console.log(res.data);
                    dispatch(setUserProfile(res.data.user));
                }

            } catch (error) {
                
            }
        }
        fetchUserProfile();

    }, [userId]);
}

export default useGetUserProfile;