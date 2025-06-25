// routes/userRoutes.js
import express from 'express';
import { protect } from "../middlewares/authmiddlerwars.js";
import User from '../models/user.js';
import {deleteUser} from "../controllers/usercontrollers.js"
import {createUserByAdmin} from "../controllers/usercontrollers.js"
import { isAdmin } from '../middlewares/isadmin.js';

const adminRoute = express.Router();

adminRoute.get('/users', protect,isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const search = req.query.search || '';
    const query = {
      role: 'user',
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .select("-password");

    res.status(200).json({
      users,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


adminRoute.delete('/:id',protect,isAdmin,deleteUser)


adminRoute.patch('/update/:id', protect,isAdmin, async (req, res) => {
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


adminRoute.post('/create-user', protect,isAdmin, createUserByAdmin);



export default adminRoute;