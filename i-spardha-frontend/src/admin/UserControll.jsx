import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserControll = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "",
    house: "",
  });
  const [editingusername, setEditingusername] = useState(null);

  // Token from cookies
  const token = Cookies.get("accessToken");

  // Check if user is authenticated
  const isAuthenticated = token !== undefined;

  // Fetch users on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    } else {
      toast.error("Authentication required. Please log in.");
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/users/userDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT in Authorization header
          },
        }
      );
      fetchUsers();
      setFormData({
        fullName: "",
        username: "",
        password: "",
        role: "",
        house: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/deleteUser",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT in Authorization header
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      house: user.house,
      password: "",
    });
    setEditingusername(user._id); // Set the user being edited
  };

  const handleUpdateUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/modifyUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT in Authorization header
          },
        }
      );
      fetchUsers();
      setFormData({
        fullName: "",
        username: "",
        password: "",
        role: "",
        house: "",
      });
      setEditingusername(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer autoClose={3000} />

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          i Spardha 2k24 - User Access Management
        </h1>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter Full Name"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter Password"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="select">select</option>
              <option value="house-representative">House-Representative</option>
              <option value="Captain">Captain</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-medium">house</label>
            <select
              name="house"
              value={formData.house}
              onChange={(e) =>
                setFormData({ ...formData, house: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="select">select</option>
              <option value="Dominator">Dominator</option>
              <option value="Terminator">Terminator</option>
              <option value="Avengers">Avengers</option>
              <option value="Challengers">Challengers</option>
            </select>
          </div>
        </div>

        <button
          onClick={editingusername ? handleUpdateUser : handleAddUser}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editingusername ? "Update User" : "Add User"}
        </button>

        {/* Table */}
        <table className="w-full mt-6 border border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border">Full Name</th>
              <th className="p-2 border">username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">house</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">{user.house}</td>
                <td className="p-2 border flex justify-around">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserControll;
