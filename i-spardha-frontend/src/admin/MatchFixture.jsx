import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MatchFixture = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    matchNumber: "",
    gameName: "",
    house1: "",
    house2: "",
    date: "",
    gender: "",
  });

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
        "http://localhost:5000/api/v1/MatchFixture/MatchFixtureDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching user fixture:", error);
    }
  };

  const handleAddMatchFixture = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/MatchFixture/createMatchFixture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
      setFormData({
        matchNumber: "",
        gameName: "",
        house1: "",
        house2: "",
        date: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error adding user fixture:", error);
    }
  };

  return (
    <div className="font-sans bg-gray-100 p-6">
      <div className="bg-white max-w-4xl mx-auto p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          i Spardha 2k24 - Match Fixture
        </h1>

        {/* Admin Form */}
        <div className="grid gap-6 max-w-2xl mx-auto">
          <div className="form-group">
            <label htmlFor="matchNumber" className="text-gray-700 font-medium">
              Match Number:
            </label>
            <input
              type="text"
              id="matchNumber"
              value={formData.matchNumber}
              onChange={(e) =>
                setFormData({ ...formData, matchNumber: e.target.value })
              }
              placeholder="Enter Match Number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="game" className="text-gray-700 font-medium">
              Game Name:
            </label>
            <input
              type="text"
              id="game"
              value={formData.game}
              onChange={(e) =>
                setFormData({ ...formData, game: e.target.value })
              }
              placeholder="Enter Game Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="house1" className="text-gray-700 font-medium">
              House 1:
            </label>
            <input
              type="text"
              id="house1"
              value={formData.house1}
              onChange={(e) =>
                setFormData({ ...formData, house1: e.target.value })
              }
              placeholder="Enter House 1 Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="house2" className="text-gray-700 font-medium">
              House 2:
            </label>
            <input
              type="text"
              id="house2"
              value={formData.house2}
              onChange={(e) =>
                setFormData({ ...formData, house2: e.target.value })
              }
              placeholder="Enter House 2 Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="text-gray-700 font-medium">
              Gender:
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="boy">boy</option>
              <option value="girl">girl</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date" className="text-gray-700 font-medium">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            onClick={handleAddMatchFixture}
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add match
          </button>
        </div>

        {/* user Fixture Table */}
        <h2 className="text-xl font-semibold text-gray-800 mt-8 text-center">
          Upcoming Matches
        </h2>
        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                Match Number
              </th>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                Game Name
              </th>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                House 1
              </th>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                House 2
              </th>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                Gender
              </th>
              <th className="px-4 py-2 text-gray-800 font-medium bg-blue-500 text-white">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{user.matchNumber}</td>
                <td className="px-4 py-2">{user.gameName}</td>
                <td className="px-4 py-2">{user.teams[0].house}</td>
                <td className="px-4 py-2">{user.teams[1].house}</td>
                <td className="px-4 py-2">{user.gender}</td>
                <td className="px-4 py-2">{user.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchFixture;
