import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt.js'
import User from "../models/user.js"


export const signup = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const userexit = await User.findOne({ email });
      if (userexit) {
        return res.status(400).json({ message: "The user already exists" });
      }
  
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role });
  
      res.json({
        token: generateToken(user),
        user: { name: user.name, role: user.role },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Something went wrong in signup" });
    }
  };
  


export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userexit = await User.findOne({ email });
  
      if (!userexit) {
        return res.status(400).json({ message: "The user does not exist" });
      }
  
      const isSame = await bcrypt.compare(password, userexit.password); 
  
      if (!isSame) {
        return res.status(400).json({ message: "The password is not correct" });
      }
  
      res.json({
        token: generateToken(userexit),
        user: { name: userexit.name, email:userexit.email ,role: userexit.role },
      });
  
    } catch (error) {
      console.error("Signin error:", error); // log the actual error
      res.status(500).json({ message: "Something went wrong in signin" });
    }
  };
  