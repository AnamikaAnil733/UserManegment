import express from 'express';
import { signup,signin ,refreshAccessToken} from "../controllers/authcontrollers.js";
const router = express.Router()


router.post('/register', signup) 
router.post('/login', signin)    
router.post('/refresh-token', refreshAccessToken); 




export default router