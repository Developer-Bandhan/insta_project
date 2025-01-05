import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null

    },
    reducers: {
        // actions
        setAuthUser: (state, action) => {
            state.user = action.payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setselectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }


    }
})

export const {
    setAuthUser,
    setSuggestedUsers,
    setUserProfile,
    setselectedUser,
} = authSlice.actions;
export default authSlice.reducer;


{/*
    1. first createSlice import kore nite hobe, 
       tarpor authSlice create korte hobe, er vetore prothome name r initialState define korte hobe
       tarpor reducers er vetore setAuthUser action create korte hobe, 
       tarpor action er payload e user.store korte hobe.
       tarpor setAuthUser export korte hobe, 
       tarpor authSlice.reducer export korte hobe, tarpor rootReducer er vetore authSlice.reducer add korte hobe.
    
    
    
    
    */}