import { Player } from "../models/playerModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Player
const createPlayer = asyncHandler(async (req, res) => {
  const { fullName, gender, branch, house, game, year, mobile } = req.body;

  if ([fullName, gender, branch, house].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const playerData = { fullName, gender, branch, house, year, mobile };

  if (game) {
    const isGameValid = await Game.findById(game);
    if (!isGameValid) {
      throw new ApiError(404, "Invalid game ID provided");
    }
    playerData.game = game;
  }

  const player = await Player.create(playerData);

  if (!player) {
    throw new ApiError(400, "something went wrong");
  }

  return res.status(201).json(new ApiResponse(201, player, "player created successfully"));
});

// Get All Players with optional house filter
const getAllPlayers = asyncHandler(async (req, res) => {
  const { house } = req.query; // Get house filter from query parameters

  let filter = {}; // Initialize filter object

  if (house) {
    filter.house = house; // If house filter is present, apply the filter
  }

  const playerData = await Player.find(filter); // Fetch players with the filter applied

  if (!playerData || playerData.length === 0) {
    throw new ApiError(404, "No players found");
  }

  return res.status(200).json(new ApiResponse(200, playerData, "players fetched successfully"));
});

// Delete Player by ID
const deletePlayer = asyncHandler(async (req, res) => {
  const { playerId } = req.params; // Get playerId from the URL parameters

  // Find and delete the player
  const player = await Player.findByIdAndDelete(playerId);

  if (!player) {
    throw new ApiError(404, "Player not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Player deleted successfully"));
});

const updatePlayer = asyncHandler(async (req, res) => {
  const { fullName, gender, year, branch, house, mobile } = req.body;

  if(!fullName || !gender || !year || !branch || !house || !mobile) {
    throw new ApiError(400, "All field are required")
  }

  const player = await Player.findOneAndUpdate(
    { mobile },
    {
      fullName, 
      gender, 
      year,
      branch, 
      house, 
      mobile
    },
    {
      new: true
    }
  ).select("-password -refreshToken");

  if (!player) {
    throw new ApiError(404, "Player not found");
  }

  return res.status(200).json(
    new ApiResponse(201, player, "Player details updated successfully")
  );
});


export {
  createPlayer,
  getAllPlayers,
  deletePlayer,
  updatePlayer
};
