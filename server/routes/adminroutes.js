// routes/userRoutes.js
import express from 'express';
import { protect } from "../middlewares/authmiddlerwars.js";
import User from '../models/user.js';
import {deleteUser} from "../controllers/usercontrollers.js"

const adminRoute = express.Router();

adminRoute.get('/users', protect, async (req, res) => {
  
  const users = await User.find({});
  if (!users) return res.status(404).json({ message: "Users not found" });
  res.json(users);
});


adminRoute.delete('/:id',protect,deleteUser)


adminRoute.patch('/update/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { name } = req.body;
  const userId = req.params.id;

  try {
    await User.findByIdAndUpdate(userId, { name });
    res.status(200).json({ message: "Name updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});



export default adminRoute;