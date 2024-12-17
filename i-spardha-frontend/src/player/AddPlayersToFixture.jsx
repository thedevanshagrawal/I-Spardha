import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlayersToFixture = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]); // Players data from backend
  const [selectedMatch, setSelectedMatch] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]); // Selected players for the match
  const [formData, setFormData] = useState({
    matchNumber: "",
    house: "",
    players: [],
    gender: "",
  });
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (token) {
      fetchMatchFixtures();
    } else {
      toast.error("Authentication required. Please log in.");
    }
  }, [token]);

  const fetchMatchFixtures = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/matchFixture/matchFixtureDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { matchesWithHouse, result } = response.data.data;
      setMatches(matchesWithHouse);
      setPlayers(result);
    } catch (error) {
      console.error("Error fetching match fixtures:", error);
    }
  };

  const handleAddPlayers = async () => {
    if (!selectedMatch || !selectedHouse || selectedPlayers.length === 0) {
      toast.error("Please select a match, house, and at least one player.");
      return;
    }

    try {
      const formData = {
        matchNumber: selectedMatch,
        house: selectedHouse,
        players: selectedPlayers,
        gender: selectedGender,
      };

      await axios.post(
        "http://localhost:5000/api/v1/matchFixture/addPlayersToFixture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Players added successfully!");
    } catch (error) {
      toast.error("Error adding players: " + error.response?.data?.message);
    }
  };

  const togglePlayerSelection = (playerId) => {
    setSelectedPlayers((prevSelectedPlayers) =>
      prevSelectedPlayers.includes(playerId)
        ? prevSelectedPlayers.filter((id) => id !== playerId)
        : [...prevSelectedPlayers, playerId]
    );
  };

  return (
    <div className="font-sans bg-gray-100 p-6">
      <div className="bg-white max-w-4xl mx-auto p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add Players to Match Fixture
        </h1>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Match Selection */}
          <div className="form-group">
            <label htmlFor="matchNumber" className="text-gray-700 font-medium">
              Select Match Fixture:
            </label>
            <select
              id="matchNumber"
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Match</option>
              {matches.map((match) => (
                <option key={match.matchNumber} value={match.matchNumber}>
                  {match.matchNumber} - {match.gameName || "No Game Name"}
                </option>
              ))}
            </select>
          </div>

          {/* House Selection */}
          <div className="form-group">
            <label htmlFor="house" className="text-gray-700 font-medium">
              Select House:
            </label>
            <select
              id="house"
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select House</option>
              {matches
                .map((match) => match.house)
                .filter((house, index, self) => self.indexOf(house) === index) // Unique houses
                .map((house) => (
                  <option key={house} value={house}>
                    {house}
                  </option>
                ))}
            </select>
          </div>

          {/* House Gender */}
          <div className="form-group">
            <label htmlFor="gender" className="text-gray-700 font-medium">
              Select Gender:
            </label>
            <select
              id="gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              {matches
                .map((match) => match.gender)
                .filter((gender, index, self) => self.indexOf(gender) === index) // Unique genders
                .map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
            </select>
          </div>

          {/* Players List */}
          <div className="form-group">
            <label className="text-gray-700 font-medium">
              Select Players:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {players.map((player) => (
                <div
                  key={player.fullName}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedPlayers.includes(player.fullName)
                      ? "bg-blue-100"
                      : "bg-gray-50"
                  }`}
                  onClick={() => togglePlayerSelection(player.fullName)}
                >
                  <p>
                    <strong>Name:</strong> {player.fullName}
                  </p>
                  <p>
                    <strong>Branch:</strong> {player.branch}
                  </p>
                  <p>
                    <strong>Year:</strong> {player.year}
                  </p>
                  <p>
                    <strong>Gender:</strong> {player.gender}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddPlayers}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add Players
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddPlayersToFixture;
