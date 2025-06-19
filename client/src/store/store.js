import { configureStore } from "@reduxjs/toolkit";
import authreducer from "../auth/authslice"

export const store = configureStore({
    reducer:{
        auth: authreducer,
    }
    
})

