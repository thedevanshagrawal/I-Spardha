import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            lowercase: true
        },
        gender: {
            type: String,
            lowercase: true,
            enum: ["boy", "girl"]
        },
        branch: {
            type: String,
            lowercase: true,
            lowercase: true
        },
        year: {
            type: Number
        },
        house: {
            type: String,
            lowercase: true,
            enum: ['dominator', 'terminator', 'challengers', 'avengers']
        },
        mobile: {
            type: Number,
            unique: true
        },
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game"
        }
    },
    {
        timestamps: true
    }
)

export const Player = mongoose.model("Player", playerSchema)