import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("/admin/create-user", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      Swal.fire({
        icon: "success",
        title: "User Created",
        text: `${res.data.user.name} has been created successfully.`,
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
      setErrors({});
    } catch (err) {
      console.error("Create user error:", err);
      Swal.fire({
        icon: "error",
        title: "User creation failed",
        text:
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong",
      });
    }
  };

  return (

    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 px-4">
           <button
        onClick={()=>navigate("/admin",{replace:true})}
        className="absolute top-4 left-4 bg-rose-400 hover:bg-rose-500 text-white px-4 py-1 rounded-md shadow-md transition duration-300 text-sm"
      >
        ⬅ back
      </button>
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-xl border border-pink-200">
   
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Create New User
        </h1>

        <form onSubmit={handleCreateUser} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {errors.name && <p className="text-pink-500 text-sm">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {errors.email && <p className="text-pink-500 text-sm">{errors.email}</p>}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-pink-50 text-purple-800 placeholder-purple-400 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-4 text-purple-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-pink-500 text-sm">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
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

          {/* Role Dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-pink-50 text-purple-800 rounded-xl border border-pink-200"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-purple-300 hover:bg-purple-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-sm hover:shadow-md"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
