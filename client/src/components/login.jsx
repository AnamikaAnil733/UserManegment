import React, { useState } from "react";
import axios from "../utils/axiosInstance"; ;
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSucess } from "../auth/authslice";
import Swal from 'sweetalert2'; 
import { toast } from 'react-toastify';


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
    
       
        localStorage.setItem("token", res.data.accessToken);
    
       
        dispatch(
          loginSucess({
            token: res.data.accessToken,
            user: res.data.user,
          })
        );
    
        console.log("Login response:", res.data);
    
        //Navigate based on role
        if (res.data.user.role === "admin") {
          toast.success("Login Successful");
          navigate("/admin",{replace:true});
        } else {
          toast.success("Login Successful");
          navigate("/profile",{replace:true});
        }
    
      } catch (err) {
        console.error("Login error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err?.response?.data?.message || 'Something went wrong',
        });
      }
    };
    
      
    return (
      <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 px-4">
        <div className="w-full max-w-sm p-8 bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h1>
    
          <form onSubmit={handlelogin} className="space-y-5">
            <input
              type="email"
              placeholder=" Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            {errors.email && <p className="text-pink-500 text-sm">{errors.email}</p>}
    
            <input
              type="password"
              placeholder=" Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
            {errors.password && <p className="text-pink-500 text-sm">{errors.password}</p>}
    
            <button
              type="submit"
              className="w-full bg-purple-300 hover:bg-purple-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-sm hover:shadow-md"
            >
              Login
            </button>
    
            <p className="text-sm text-center text-purple-500">
              If you don't have an account,{" "}
              <span
                onClick={() => navigate("/signup",{replace:true})}
                className="text-purple-700 font-semibold cursor-pointer hover:underline"
              >
                sign up here
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </>
    
    )

}

export default Login