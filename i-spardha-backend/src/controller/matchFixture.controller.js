import { Game } from "../models/gameModel.js"
import { MatchFixture } from "../models/matchFixtureModel.js"
import { Player } from "../models/playerModel.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { format } from "date-fns"


const createMatchFixture = asyncHandler(async (req, res) => {
    const { matchNumber, gameName, date, house1, house2, gender } = req.body

    if ([gameName, house1, house2, gender].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    const teams = [
        { house: house1.toLowerCase(), players: [] },
        { house: house2.toLowerCase(), players: [] }
    ]

    const matchFixture = await MatchFixture.create({
        matchNumber,
        date,
        gameName,
        teams,
        gender
    })

    if (!matchFixture) {
        throw new ApiError(404, "matchfixture error")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, matchFixture, "Match fixture created successfully. Captains can now add players.")
        )
})

const addPlayersToFixture = asyncHandler(async (req, res) => {
    const { matchNumber, house, players } = req.body;

    console.log("matchNumber: ", matchNumber)
    console.log("house: ", house)
    console.log("players: ", players)

    if (!matchNumber) {
        throw new ApiError(400, "matchNumber is required")
    }

    const matchFixture = await MatchFixture.findOne({ matchNumber })

    if (!matchFixture) {
        throw new ApiError(404, "Match fixture not found")
    }

    const team = matchFixture.teams.find(
        (team) => team.house === house.toLowerCase()
    )

    if (!team) {
        throw new ApiError(404, `House ${house} not found in this fixture`)
    }

    for (const playerName of players) {
        const player = await Player.findOne({ fullName: players, house: house.toLowerCase() });
        console.log("Player.fullName: ", players)
        if (!player) {
            return res.status(404).json({ message: `Player ${players} not found in house ${house}` });
        }
        if (player.gender !== matchFixture.gender) {
            return res.status(400).json({
                message: `Player ${player.fullName} does not match the gender ${matchFixture.gender}`,
            });
        }
        if (!team.players.includes(player._id)) {
            team.players.push(player._id);
        }
    }

    await matchFixture.save();

    return res.status(200)
        .json(
            new ApiResponse(201, matchFixture, "Players added successfully to the team")
        )

})

const matchFixtureDetails = asyncHandler(async (req, res) => {
    const matchFixture = await MatchFixture.find()

    if (!matchFixture) {
        throw new ApiError(400, "match fixture not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, matchFixture, "match fixture fetched successfully")
        )
})

export {
    createMatchFixture,
    addPlayersToFixture,
    matchFixtureDetails
}