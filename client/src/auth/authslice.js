import { createSlice } from "@reduxjs/toolkit";

const tokenfromstroage = localStorage.getItem("token");
const userfromlocalStroage = JSON.parse(localStorage.getItem("user"));


const authSlice = createSlice({
    name :'auth',
    initialState:{
        token :tokenfromstroage ||null,
        user:userfromlocalStroage || null
        
    }, 
    reducers:{
        loginSucess:(state,action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem("token",action.payload.token);
            localStorage.setItem("user",JSON.stringify(action.payload.user))
        },
        logout:(state)=>{
            state.token = null
            state.user = null
            localStorage.removeItem('token');
            localStorage.removeItem('user')
        }
    },
})

export const {loginSucess,logout} = authSlice.actions
export default authSlice.reducer