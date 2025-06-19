import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { logout } from '../auth/authslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch user and profile image
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

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // ✅ Upload to Cloudinary and save to DB
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

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
        // ✅ Save Cloudinary image to backend
        await axios.put("/users/update-profile-image", {
          image: data.secure_url,
        });

        setCloudinaryUrl(data.secure_url);
        setPreviewUrl(null);
        setImage(null);
        alert("Upload successful!");
      } else {
        throw new Error("Invalid Cloudinary response");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Welcome, {user.name}
      </h2>
      <p className="text-center text-gray-600 mb-4">Email: {user.email}</p>

      <div className="flex justify-center mb-6">
        <img
          src={cloudinaryUrl}
          alt=""
          className="w-36 h-36 rounded-full object-cover border-2 border-blue-400"
        />
      </div>

      <form onSubmit={handleUpload} className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {previewUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 text-center">Image Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-36 h-36 object-cover rounded-full border mx-auto"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Upload Your Profile Photo
        </button>
      </form>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
