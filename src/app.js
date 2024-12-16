import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'

const app = express()
dotenv.config();


app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Ensure credentials are allowed (cookies, headers)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionSuccessStatus: 200
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/userRouter.js"
import playerRouter from "./routes/playerRouter.js"
import gameRouter from "./routes/gameRouter.js"
import matchFixtureRouter from "./routes/matchFixtureRouter.js"
import PointTableRouter from "./routes/PointTableRouter.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/players", playerRouter)
app.use("/api/v1/games", gameRouter)
app.use("/api/v1/matchFixture", matchFixtureRouter)
app.use("/api/v1/pointTable", PointTableRouter)

export { app }