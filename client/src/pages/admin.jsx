import React, { useState, useEffect } from 'react';
import axios from "../utils/axiosInstance";
import { logout } from '../auth/authslice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedNames, setEditedNames] = useState({});

  const dispatch= useDispatch()

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('/admin/users');
    setUsers(res.data);

    const names = {};
    res.data.forEach((u) => {
      names[u._id] = u.name;
    });
    setEditedNames(names);
  };

   const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };

  const deleteUser = async (id) => {
  

  const confirmDelete  = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });
  if (!confirmDelete.isConfirmed) return;
  try {
    await axios.delete(`/admin/${id}`);
    toast.success("Deleted successfully");
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Failed to delete user");
  }
  };

  const updateUser = async (id) => {
    const newName = editedNames[id];
    if (!newName.trim()) return toast.error("Name cannot be empty");

    try {
      await axios.patch(`/admin/update/${id}`, { name: newName });
      setEditingUserId(null);
      toast.success("Updated Successful");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-pink-100 to-purple-100 min-h-screen">
    <h2 className="text-3xl font-bold mb-8 text-center text-purple-700">Admin Dashboard</h2>
  
    <div className="mb-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search user by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
      />
    </div>
  
    <div className="overflow-x-auto rounded-2xl shadow-xl bg-white bg-opacity-80 backdrop-blur-md">
      <table className="min-w-full text-sm text-purple-800">
        <thead className="bg-pink-200 text-purple-900">
          <tr>
            <th className="py-4 px-6 text-left">Name</th>
            <th className="py-4 px-6 text-left">Email</th>
            <th className="py-4 px-6 text-left">Role</th>
            <th className="py-4 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) =>
            u.role === 'user' ? (
              <tr key={u._id} className="border-b border-purple-100 hover:bg-pink-50 transition">
                <td className="py-3 px-6">
                  {editingUserId === u._id ? (
                    <input
                      type="text"
                      value={editedNames[u._id]}
                      onChange={(e) =>
                        setEditedNames({ ...editedNames, [u._id]: e.target.value })
                      }
                      className="border border-pink-300 rounded px-2 py-1 w-full bg-white text-purple-800"
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6 capitalize">{u.role}</td>
                <td className="py-3 px-6 space-x-2">
                  {editingUserId === u._id ? (
                    <>
                      <button
                        onClick={() => updateUser(u._id)}
                        className="bg-green-300 text-white px-3 py-1 rounded-full hover:bg-green-400 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-300 text-white px-3 py-1 rounded-full hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUserId(u._id)}
                        className="bg-yellow-300 text-white px-3 py-1 rounded-full hover:bg-yellow-400 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-300 text-white px-3 py-1 rounded-full hover:bg-red-400 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
  
      <div className="p-4 text-center">
        <button
          onClick={handleLogout}
          className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 mt-4 rounded-xl shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
  
    
  );
}

export default AdminPage;
