import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { logout } from '../auth/authslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function Profile() {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Fetch user and profile image
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/users/me');
        setUser(res.data);
        setCloudinaryUrl(res.data.image); // get profile image from DB
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  //  Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login',{replace:true});
    toast.success("Logout Sucessfully");
  };

  // Upload to Cloudinary and save to DB
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
        //  Save Cloudinary image to backend
        await axios.put("/users/update-profile-image", {
          image: data.secure_url,
        });

        setCloudinaryUrl(data.secure_url);
        setPreviewUrl(null);
        setImage(null);
        toast.success(" upload Successful");
      } else {

        throw new Error("Invalid Cloudinary response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed.");
      
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
    <p className="text-center text-purple-500 mb-6">Email: {user.email}</p>
  
    <div className="flex justify-center mb-6">
      <img
        src={cloudinaryUrl || "/photo.png"}
        alt="Profile"
        className="w-36 h-36 rounded-full object-cover border-4 border-pink-300 shadow-lg hover:scale-105 transition duration-300"
      />
    </div>
  
    <form onSubmit={handleUpload} className="flex flex-col items-center space-y-6">
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
  
   
  
      </form>
  
      <button  
        type="submit"        onClick={() => navigate('/edit',{replace:true})} 
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-2 rounded-full shadow-lg hover:from-purple-500 hover:to-pink-500 hover:scale-105 transition duration-300 font-semibold"
       >
       Edit
      </button>
  
  </div>
  
  
  </>
  );
}

export default Profile;
