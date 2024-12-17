import { Game } from "../models/gameModel.js"
import { MatchFixture } from "../models/matchFixtureModel.js"
import { Player } from "../models/playerModel.js"
import { User } from "../models/userModel.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"


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
    const { matchNumber, house, players, gender } = req.body;

    if (!matchNumber) {
        throw new ApiError(400, "Match number is required.");
    }

    if (!house) {
        throw new ApiError(400, "House is required.");
    }

    if (!gender) {
        throw new ApiError(400, "Gender is required.");
    }

    if (!Array.isArray(players) || players.length === 0) {
        throw new ApiError(400, "At least one player must be selected.");
    }

    // Fetch the match fixture
    const matchFixture = await MatchFixture.findOne({ matchNumber });

    if (!matchFixture) {
        throw new ApiError(404, "Match fixture not found.");
    }

    // Check if the house exists in the fixture
    const team = matchFixture.teams.find(
        (team) => team.house === house.toLowerCase()
    );

    if (!team) {
        throw new ApiError(404, `House ${house} not found in this match fixture.`);
    }

    // Validate each player
    for (const playerName of players) {
        const player = await Player.findOne({
            fullName: playerName,
            house: house.toLowerCase(),
        });

        if (!player) {
            return res.status(404).json({
                message: `Player ${playerName} not found in house ${house}.`,
            });
        }

        if (player.gender !== gender) {
            // console.log("player.gender:", player.gender);
            // console.log("gender:", gender);
            return res.status(400).json({
                message: `Player ${player.fullName} does not match the gender ${gender} specified for this match.`,
            });
        }

        // Add the player to the team if not already added
        if (!team.players.includes(player._id)) {
            team.players.push(player._id);
        }
    }

    // Save the updated match fixture
    await matchFixture.save();

    return res.status(200).json(
        new ApiResponse(
            201,
            matchFixture,
            "Players successfully added to the match fixture."
        )
    );
});



// const addPlayerToHouse = asyncHandler(async (req, res) => {
//     const { playerName, house } = req.body;  // Getting playerName and house from frontend

//     // Validate input
//     if (!playerName || !house) {
//         throw new ApiError(400, "Player name and house are required.");
//     }

//     // Find the player by name
//     const player = await Player.findOne({ fullName: playerName.toLowerCase() });
//     if (!player) {
//         throw new ApiError(404, "Player not found.");
//     }

//     // Ensure the player is from the correct house (case insensitive)
//     if (player.house !== house.toLowerCase()) {
//         throw new ApiError(400, "Player does not belong to the specified house.");
//     }

//     // Find the match fixture by house (house must exist in one of the teams)
//     const matchFixture = await MatchFixture.findOne({ "teams.house": house.toLowerCase() });
//     if (!matchFixture) {
//         throw new ApiError(404, "Match fixture not found for the specified house.");
//     }

//     // Find the team (house) in the match fixture
//     const team = matchFixture.teams.find(team => team.house === house.toLowerCase());
//     if (!team) {
//         throw new ApiError(404, `${house} team not found in this match fixture.`);
//     }

//     // Check if the player is already part of the house
//     if (team.players.includes(player._id)) {
//         throw new ApiError(400, "Player is already added to the team.");
//     }

//     // Add the player to the team (house)
//     team.players.push(player._id);

//     // Save the match fixture with the updated players
//     await matchFixture.save();

//     return res.status(200).json({
//         message: `Player ${playerName} added to ${house} team successfully.`,
//         matchFixture
//     });
// });

// const matchFixtureDetails = asyncHandler(async (req, res) => {

//     const inputId = req.user._id;

//     const userId = new mongoose.Types.ObjectId(inputId);

//     const userDetail = await User.findById(userId)
//     // userDetail.house
//     const houseCompare = userDetail.house
//     const matchFixture = await MatchFixture.find({'teams.house': houseCompare})
//     const playerDetail = await Player.find({house: houseCompare})
//     const result = playerDetail.map(({ fullName, branch, year }) => ({ fullName, branch, year }));


//     const matchesWithHouse = matchFixture.map((match) => {
//         const house = match.teams.find((team) => team.house === houseCompare);
//         if (house) {
//           return {
//             matchNumber: match.matchNumber,
//             gameName: match.gameName || null, // Some matches may have gameName

//             house: house.house,
//             players: house.players,
//           };
//         }
//         return null;
//       }).filter(Boolean); 




//     // console.log("playerDetail:", playerDetail)
//     // console.log("userDetail.house:", userDetail.house)
//     // console.log("result: ", result);
//     // console.log("matchesWithHouse: ", matchesWithHouse);

//     if (!matchFixture) {
//         throw new ApiError(400, "match fixture not found")
//     }

//     return res.status(200)
//         .json(
//             new ApiResponse(201, {matchesWithHouse, houseCompare, result}, "match fixture fetched successfully")
//         )
// })

const matchFixtureDetails = asyncHandler(async (req, res) => {
    try {
        const inputId = req.user._id;

        // Validate inputId
        if (!inputId) {
            throw new ApiError(400, "User ID is required.");
        }

        const userId = new mongoose.Types.ObjectId(inputId);

        // Fetch user details
        const userDetail = await User.findById(userId).lean();
        if (!userDetail) {
            throw new ApiError(404, "User not found.");
        }

        const houseCompare = userDetail.house;
        if (!houseCompare) {
            throw new ApiError(400, "User does not belong to any house.");
        }

        // Fetch match fixtures and players in parallel
        const [matchFixture, playerDetail] = await Promise.all([
            MatchFixture.find({ 'teams.house': houseCompare }).lean(),
            Player.find({ house: houseCompare }).lean()
        ]);

        // Process player details
        const result = playerDetail.map(({ fullName, branch, year, gender }) => ({
            fullName,
            branch,
            year,
            gender
        }));

        // Process matches with the specific house
        const matchesWithHouse = matchFixture.map((match) => {
            const house = match.teams.find((team) => team.house === houseCompare);
            if (house) {
                return {
                    matchNumber: match.matchNumber,
                    gameName: match.gameName || null,
                    house: house.house,
                    players: house.players,
                    gender: match.gender,
                };
            }
            return null;
        }).filter(Boolean);

        // console.log("matchesWithHouse: ", matchesWithHouse)

        // Check if matches were found
        if (!matchesWithHouse.length) {
            throw new ApiError(404, "No matches found for the specified house.");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                { matchesWithHouse, houseCompare, result },
                "Match fixture fetched successfully"
            )
        );
    } catch (error) {
        // Error Handling
        console.error("Error fetching match fixtures:", error);
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const getAllMatchFixture = asyncHandler(async (req, res) => {
    const matchFixtureDetails = await MatchFixture.find()

    if (!matchFixtureDetails) {
        throw new ApiError(404, "match fixture not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, matchFixtureDetails, "mathc fixture fetched successfully")
        )
})


export {
    createMatchFixture,
    addPlayersToFixture,
    // addPlayerToHouse,
    matchFixtureDetails,
    getAllMatchFixture
}