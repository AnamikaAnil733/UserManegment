import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../utils/axiosInstance"; 
import { loginSucess } from "../auth/authslice";


function Register() {

    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("user")
    const [errors, setErrors] = useState({});


    const navigate = useNavigate()
    const dispatch = useDispatch()


    const validate = () => {
      const newErrors = {};
    
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
      if (!password.trim()) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    

    const handleregister = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
          const res = await axios.post("/auth/register", {
            name,
            password,
            email,
            role,
          });
          dispatch(loginSucess(res.data));
          navigate(role === "admin" ? "/admin" : "/profile");
        } catch (err) {
          console.log("Error:", err.response?.data);
          alert("Signup failed: " + (err.response?.data?.message || "Unknown error"));
        }
      };
      

    return (
        <>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Sign Up</h1>

    <form onSubmit={handleregister} className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        onChange={(e) => setName(e.target.value)}
       
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      <input
        type="email"
        placeholder="Your Email"
        onChange={(e) => setEmail(e.target.value)}
      
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
     
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <select
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
      >
        Submit
      </button>
    </form>
  </div>
</div>

        </>
    )
}


export default Register