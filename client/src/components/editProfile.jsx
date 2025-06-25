import React, { useState, useEffect } from 'react';
import axios from "../utils/axiosInstance";
import { logout } from "../auth/authslice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditProfile() {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/users/me');
        setUser(res.data);
        setCloudinaryUrl(res.data.image);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success("Logout Successfully");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an Image");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "usermangement");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dyueeudmg/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        await axios.put("/users/update-profile-image", {
          image: data.secure_url,
        });

        setCloudinaryUrl(data.secure_url);
        setPreviewUrl(null);
        setImage(null);
       
        toast.success("Upload Successful");

    
      } else {
        throw new Error("Invalid Cloudinary response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed.");
    }
  };

  // ✅ Handle updating name and email
  const handleSaveChanges = async () => {
    try {
      const res = await axios.put('/users/update', {
        name,
        email,
      });
      setUser(res.data);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Update failed");
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 bg-rose-400 hover:bg-rose-500 text-white px-4 py-1 rounded-md shadow-md transition duration-300 text-sm"
      >
        ⬅ Logout
      </button>

      <div className="relative p-8 max-w-md mx-auto bg-white bg-opacity-70 backdrop-blur-xl rounded-3xl shadow-2xl mt-10 border border-purple-200">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Welcome, {user.name}</h2>

        <div className="flex justify-center mb-6">
          <img
            src={cloudinaryUrl || "/photo.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-pink-300 shadow-lg hover:scale-105 transition duration-300"
          />
        </div>

        <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer px-6 py-2 bg-gradient-to-r from-pink-200 to-purple-200 text-purple-800 rounded-full shadow-md hover:from-pink-300 hover:to-purple-300 hover:scale-105 transition duration-300 font-semibold"
          >
            Choose Profile Photo
          </label>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-2 rounded-full shadow-lg hover:from-purple-500 hover:to-pink-500 hover:scale-105 transition duration-300 font-semibold"
          >
            Upload
          </button>
        </form>

        {/* Editable Fields */}
        <div className="mt-6 flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSaveChanges}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300 font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
