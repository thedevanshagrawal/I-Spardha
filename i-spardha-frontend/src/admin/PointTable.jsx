import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PointTable = () => {
  const [pointTable, setPointTable] = useState([]); // Stores points
  const [games, setGames] = useState([]); // Stores list of games dynamically
  const [formData, setFormData] = useState({
    house: "",
    gameName: "",
    points: "",
  });
  const [newGameName, setNewGameName] = useState(""); // For adding new games

  const token = Cookies.get("accessToken");
  const isAuthenticated = token !== undefined;

  // Fetch Points and Games on Component Mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPoints();
      fetchGames();
    } else {
      toast.error("Authentication required. Please log in.");
    }
  }, [isAuthenticated]);

  // Fetch Points from Backend API
  const fetchPoints = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/pointTable/getPointTable",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPointTable(response.data.data); // Update the point table data
    } catch (error) {
      toast.error("Failed to fetch point table.", error);
    }
  };

  // Fetch Game List from Backend API
  const fetchGames = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/pointTable/getGames",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames(response.data.data); // Update the list of games
    } catch (error) {
      toast.error("Failed to fetch games.", error);
    }
  };

  // Handle Add Points
  const handleAddPoints = async () => {
    if (!formData.gameName) {
      toast.error("Please provide a valid game name.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/v1/pointTable/addPoints",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPoints(); // Refresh point table
      setFormData({ house: "", gameName: "", points: "" });
      toast.success("Points added successfully!");
    } catch (error) {
      toast.error("Failed to add points.", error);
    }
  };

  // Handle Add New Game
  const handleAddGame = async () => {
    if (!newGameName.trim()) {
      toast.error("Game name cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/v1/pointTable/addGame",
        { gameName: newGameName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGames(); // Refresh game list with the newly added game
      setNewGameName(""); // Reset input field
      toast.success("Game added successfully!");
    } catch (error) {
      toast.error("Failed to add game.", error);
    }
  };

  // Reset Points for all games and houses
  const handleResetPoints = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/pointTable/resetPoints",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPoints(); // Refresh point table after resetting points
      toast.success("Points reset successfully!");
    } catch (error) {
      toast.error("Failed to reset points.", error);
    }
  };

  // Calculate Total Points for a House
  const calculateTotalPoints = (house) => {
    return pointTable
      .filter((item) => item.house.toLowerCase() === house.toLowerCase()) // Normalize house names
      .reduce((sum, game) => sum + parseInt(game.points || 0), 0);
  };

  // Get Points for a Specific House and Game
  const getPointsForHouseAndGame = (house, game) => {
    const pointData = pointTable.find(
      (item) => item.house.toLowerCase() === house.toLowerCase() && item.gameName.toLowerCase() === game.toLowerCase()
    );
    return pointData ? pointData.points : 0;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer autoClose={3000} />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          iSpardha 2k24 - Point Table Management
        </h1>

        {/* Form to Add Points */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">House</label>
            <select
              name="house"
              value={formData.house}
              onChange={(e) =>
                setFormData({ ...formData, house: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Dominator">Dominator</option>
              <option value="Terminator">Terminator</option>
              <option value="Avengers">Avengers</option>
              <option value="Challengers">Challengers</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Game Name</label>
            <input
              type="text"
              name="gameName"
              value={formData.gameName}
              onChange={(e) =>
                setFormData({ ...formData, gameName: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter New Game Name"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Points</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter Points"
            />
          </div>
        </div>

        <button
          onClick={handleAddPoints}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Points
        </button>

        {/* Reset Points Button */}
        <button
          onClick={handleResetPoints}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Reset All Points
        </button>

        {/* Point Table */}
        <table className="w-full mt-6 border border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border text-center">Game Name</th>
              {["Dominator", "Terminator", "Avengers", "Challengers"].map(
                (house) => (
                  <th key={house} className="p-2 border text-center">
                    {house}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game} className="hover:bg-gray-100">
                <td className="p-2 border text-center font-medium">{game}</td>
                {["Dominator", "Terminator", "Avengers", "Challengers"].map(
                  (house) => (
                    <td key={house} className="p-2 border text-center">
                      {getPointsForHouseAndGame(house, game)}
                    </td>
                  )
                )}
              </tr>
            ))}
            {/* Total Points Row */}
            <tr className="bg-gray-200 font-bold">
              <td className="p-2 border text-center">Total Points</td>
              {["Dominator", "Terminator", "Avengers", "Challengers"].map(
                (house) => {
                  const total = calculateTotalPoints(house);
                  return (
                    <td
                      key={`total-${house}`}
                      className="p-2 border text-center"
                    >
                      {total}
                    </td>
                  );
                }
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PointTable;

