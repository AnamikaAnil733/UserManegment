import React, { useState, useEffect } from 'react';
import axios from "../utils/axiosInstance";
import { logout } from '../auth/authslice';
import { useDispatch } from 'react-redux';

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
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    await axios.delete(`/admin/${id}`);
    fetchUsers();
  };

  const updateUser = async (id) => {
    const newName = editedNames[id];
    if (!newName.trim()) return alert("Name cannot be empty");

    try {
      await axios.patch(`/admin/update/${id}`, { name: newName });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update name");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-rose-700">Admin Dashboard</h2>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search user by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-rose-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers.map((u) =>
              u.role === 'user' ? (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    {editingUserId === u._id ? (
                      <input
                        type="text"
                        value={editedNames[u._id]}
                        onChange={(e) =>
                          setEditedNames({ ...editedNames, [u._id]: e.target.value })
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
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
                          className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded-full hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingUserId(u._id)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-full hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
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
        <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
        >
          Logout
        </button>
        </div>
      </div>
    </div>
    
  );
}

export default AdminPage;
