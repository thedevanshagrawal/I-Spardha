import mongoose from "mongoose";


const gameSchema = new mongoose.Schema(
    {
        gameName: {
            type: String,
            lowercase: true
        },
    },
    { timestamps: true }
)

export const Game = mongoose.model("Game", gameSchema)