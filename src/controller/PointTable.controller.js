import { PointTable } from "../models/pointTableModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add or update points for a specific house and game
const addPoints = asyncHandler(async (req, res) => {
    const { house, gameName, points } = req.body;

    if (!house || !gameName || points === undefined) {
        throw new ApiError(400, "House, gameName, and points are required");
    }

    const pointEntry = await PointTable.findOneAndUpdate(
        { house, gameName },
        { $inc: { points } },
        { new: true, upsert: true } // Create new entry if it doesn't exist
    );

    if (!pointEntry) {
        throw new ApiError(500, "Failed to update points");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, pointEntry, "Points updated successfully"));
});

// Get the point table sorted by points in descending order
const getPointTable = asyncHandler(async (req, res) => {
    const pointTable = await PointTable.find().sort({ points: -1 });

    if (!pointTable || pointTable.length === 0) {
        throw new ApiError(404, "Point table not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, pointTable, "Point table fetched successfully"));
});

// Reset points for all houses and games
const resetPoints = asyncHandler(async (req, res) => {
    const resetResult = await PointTable.updateMany({}, { $set: { points: 0 } });

    if (!resetResult || resetResult.modifiedCount === 0) {
        throw new ApiError(500, "Failed to reset points");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Points reset successfully"));
});

// Delete a specific house and game entry
const deleteHouseAndGame = asyncHandler(async (req, res) => {
    const { house, gameName } = req.body;

    if (!house || !gameName) {
        throw new ApiError(400, "House and gameName are required");
    }

    const deletedEntry = await PointTable.findOneAndDelete({ house, gameName });

    if (!deletedEntry) {
        throw new ApiError(404, "House and game not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "House and game deleted successfully"));
});

const getGames = asyncHandler(async (req, res) => {
    const games = await PointTable.distinct("gameName");
    return res.status(200).json(new ApiResponse(200, games, "Games fetched successfully"));
});

const addGame = asyncHandler(async (req, res) => {
    const { gameName } = req.body;
    if (!gameName) throw new ApiError(400, "Game name is required");

    // Add a new entry for the game without points
    await PointTable.create({ house: "Dominator", gameName, points: 0 });
    return res
        .status(201)
        .json(new ApiResponse(201, null, "Game added successfully"));
});

export {
    addPoints,
    getPointTable,
    resetPoints,
    deleteHouseAndGame,
    getGames,
    addGame,
};
