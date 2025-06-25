// routes/userRoutes.js
import express from 'express';
import { protect } from "../middlewares/authmiddlerwars.js";
import { uploadProfileImage,updateProfile } from '../controllers/usercontrollers.js';

import User from '../models/user.js';


const router = express.Router();

router.get('/me', protect, async (req, res) => {
  
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});


router.put('/update-profile-image', protect, uploadProfileImage);
router.put('/update', protect, updateProfile);



export default router;



