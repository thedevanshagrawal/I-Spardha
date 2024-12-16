import { Game } from "../models/gameModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createGame = asyncHandler(async (req, res) => {
    const { gameName } = req.body

    if (!gameName) {
        throw new ApiError(400, "game name is required")
    }
    

    const game = await Game.create({
        gameName
    })

    if (!game) {
        throw new ApiError(400, "something went wrong")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, game, "game created successfully")
        )
})

const getAllGame = asyncHandler(async (req, res) => {
    const games = await Game.find()

    if (!games) {
        throw new ApiError(400, "games not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, games, "games fetched successfully")
        )
})



export {
    createGame,
    getAllGame
}