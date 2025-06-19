import React, { useState } from "react";
import axios from "../utils/axiosInstance"; ;
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSucess } from "../auth/authslice"


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({});

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const validate = () => {
      const newErrors = {};
    
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
      if (!password.trim()) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    

    
    const handlelogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
          const res = await axios.post("/auth/login", { email, password });
          dispatch(loginSucess(res.data));
          console.log("Login response:", res.data);

      
          if (res.data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/profile");
          }
        } catch (error) {
          alert(error.response?.data?.message || "Login failed");
        }
      };
      
    return (
        <>
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Login</h1>

    <form onSubmit={handlelogin} className="space-y-4">
      <input
        type="email"
        placeholder="Your Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
       {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <input
        type="password"
        placeholder="Your Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
       {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
      >
        Login
      </button>
    </form>
  </div>
</div>

        </>
    )

}

export default Login