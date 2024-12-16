import { Game } from "../models/gameModel.js";
import { Player } from "../models/playerModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlayer = asyncHandler(async (req, res) => {
    const { fullName, gender, branch, house, game, year, mobile } = req.body


    if ([fullName, gender, branch, house].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const playerData = { fullName, gender, branch, house, year, mobile };

    if (game) {
        const isGameValid = await Game.findById(game)
        if (!isGameValid) {
            throw new ApiError(404, "Invalid game ID provided");
        }
        playerData.game = game
    }

    const player = await Player.create(
        playerData
    )

    if (!player) {
        throw new ApiError(400, "something went wrong")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, player, "player created successfully")
        )
})

const getAllPlayers = asyncHandler(async (req, res) => {
    const playerData = await Player.find()

    if (!playerData) {
        throw new ApiError(404, "No players found")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, playerData, "player fetched successfully")
        )
})

export {
    createPlayer,
    getAllPlayers
}