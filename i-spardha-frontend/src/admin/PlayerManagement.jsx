import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    branch: "",
    house: "",
    year: "",
    mobile: "",
    gender: "",
  });
  const [houseFilter, setHouseFilter] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const token = Cookies.get("accessToken");
  const isAuthenticated = token !== undefined;

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayers();
    }
  }, [isAuthenticated, houseFilter]);

  // Fetch players from the backend, with optional filtering by house
  const fetchPlayers = async () => {
    try {
      let url = "http://localhost:5000/api/v1/players/getAllPlayers";
      if (houseFilter) {
        url += `?house=${houseFilter}`; // Add house filter to the URL if it's selected
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlayers(response.data.data); // Set players data from the API response
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/players/createPlayer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlayers(); // Refresh the list after adding/updating a player
      setFormData({
        fullName: "",
        branch: "",
        house: "",
        year: "",
        mobile: "",
        gender: "",
      });
      toast.success("Player Added", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdatePlayer = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/players/updatePlayer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlayers(); // Refresh users list after updating
      setFormData({
        fullName: "",
        branch: "",
        house: "",
        year: "",
        mobile: "",
        gender: "",
      }); // Reset form data
      setEditingPlayerId(null); //
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  // Handle edit button click to populate the form with existing player data
  const handleEdit = (player) => {
    setFormData({
      fullName: player.fullName,
      branch: player.branch,
      house: player.house,
      year: player.year,
      mobile: player.mobile, // Ensure the mobile number is correctly set
      gender: player.gender,
    });
    setEditingPlayerId(player._id); // Set the player ID to update
  };

  // Delete player
  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/players/deletePlayer/${playerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlayers(); // Refresh the list after deletion
      toast.success("Player deleted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player."); // Show error toast
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <main className="max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-10 p-6">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">
          Manage Players
        </h2>

        {/* House filter dropdown */}
        <div className="flex justify-between items-center mb-6">
          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)} // Update house filter state
            className="p-2 border border-gray-300 rounded-md bg-gray-50"
          >
            <option value="">All Houses</option>
            <option value="Dominator">Dominator</option>
            <option value="Terminator">Terminator</option>
            <option value="Avengers">Avengers</option>
            <option value="Challengers">Challengers</option>
          </select>
        </div>

        
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            name="fullName"
            placeholder="Player Name"
            value={formData.fullName}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md"
            required
          />
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md bg-gray-50"
            required
          >
            <option value="" disabled>
              Select Branch
            </option>
            <option value="B.TECH">B.TECH</option>
            <option value="B.COM">B.COM</option>
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
            <option value="BA">BA</option>
            <option value="LLB">LLB</option>
            <option value="B.ED">B.ED</option>
            <option value="BSC">BSC</option>
            <option value="MA">MA</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
          </select>
          <select
            name="house"
            value={formData.house}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md bg-gray-50"
            required
          >
            <option value="" disabled>
              Select House
            </option>
            <option value="Dominator">Dominator</option>
            <option value="Terminator">Terminator</option>
            <option value="Avengers">Avengers</option>
            <option value="Challengers">Challengers</option>
          </select>
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile No."
            value={formData.mobile}
            onChange={handleChange}
            maxLength="10"
            pattern="\d{10}"
            title="Please enter a valid 10-digit mobile number"
            className="flex-1 min-w-[180px] p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            onClick={editingPlayerId ? handleUpdatePlayer : handleAddPlayer}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {editingPlayerId ? "Update Player" : "Add Player"}
          </button>
        </div>

        {/* Player List */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 p-2">S No.</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Branch</th>
                <th className="border border-gray-300 p-2">House</th>
                <th className="border border-gray-300 p-2">Year</th>
                <th className="border border-gray-300 p-2">Mobile No.</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player._id}>
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {player.fullName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {player.branch}
                  </td>
                  <td className="border border-gray-300 p-2">{player.house}</td>
                  <td className="border border-gray-300 p-2">{player.year}</td>
                  <td className="border border-gray-300 p-2">
                    {player.mobile}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleEdit(player)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePlayer(player._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-gray-300 p-2 text-center"
                  >
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PlayerManagement;
