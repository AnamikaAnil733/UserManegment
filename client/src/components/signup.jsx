import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../utils/axiosInstance";
import { loginSucess } from "../auth/authslice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from 'sweetalert2'; 

function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

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
      navigate(role === "admin" ? "/admin" : "/profile",{replace:true});
    } catch (err) {
      console.error("Signup error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text:
          err.res?.data?.message ||
          err.res?.data?.error ||
          err.message ||
          'Something went wrong',
      });
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 px-4">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-xl border border-pink-200">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Sign Up</h1>

        <form onSubmit={handleregister} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            placeholder=" Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {errors.name && <p className="text-pink-500 text-sm">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {errors.email && <p className="text-pink-500 text-sm">{errors.email}</p>}

          {/* Password with eye */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 text-purple-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.password && <p className="text-pink-500 text-sm">{errors.password}</p>}

          {/* Confirm Password with eye */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-3 right-4 text-purple-500 cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-pink-500 text-sm">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-300 hover:bg-purple-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-sm hover:shadow-md"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-purple-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login",{replace:true})}
              className="text-purple-700 font-semibold cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
