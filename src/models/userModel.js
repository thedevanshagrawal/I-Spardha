import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            lowercase: true
        },
        username: {
            type: String,
            unique: true,
            lowercase: true
        },
        password: {
            type: String
        },
        role: {
            type: String,
            lowercase: true,
            enum: ['admin', 'captain', 'house-representative'],
        },
        house: {
            type: String,
            lowercase: true,
            enum: ['dominator', 'terminator', 'challengers', 'avengers'],
        },
        refreshToken: {
            type: String
        },
    },
    { timestamps: true }
)


// encrypting password before saving to Db
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()

})

//checking user given password and DB saved password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)  