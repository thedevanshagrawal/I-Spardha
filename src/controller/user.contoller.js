import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, password, role, house } = req.body

    if ([fullName, username, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        throw new ApiError(409, "User with username already exist")
    }

    const user = await User.create({
        fullName,
        username,
        password,
        role,
        house
    })

    const createdUser = await User.findById(user._id).select(
        "-password refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registring user")
    }

    return res.status(201)
        .json(
            new ApiResponse(200, createdUser, "user created successfully")
        )
})

const userDetails = asyncHandler(async (req, res) => {
    const userDetails = await User.find();

    if (!userDetails) {
        throw new ApiError(400, "No user found")
    }

    return res.status(200)
        .json(
            new ApiResponse(201, userDetails, "User fethed successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body


    if (!username) {
        throw new ApiError(400, "username is required")
    }

    const user = await User.findOne({ username })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const cookieOptions = {
        httpOnly: true,        // Prevent access to cookies via JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (i.e., HTTPS)
        sameSite: "None",      // Set to "None" for cross-origin cookies (required for frontend-backend communication)
    };

    // Access token cookie with short expiration
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh token cookie with longer expiration
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200)
        .json(
            new ApiResponse(201,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1  // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged Out")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { username } = req.body; // Get userId from request body

    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const user = await User.findOneAndDelete({ username }); // Delete user from DB

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getUsernames = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    try {
        const users = await User.find({ _id: { $in: userIds } }, 'username _id');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching usernames', error });
    }
})

const modifyUser = asyncHandler(async (req, res) => {
    const { fullName, username, role, house } = req.body; // Get user data from request body

    if (!username || !fullName) {
        throw new ApiError(400, "All fields are required");
    }

    const updatedUser = await User.findOneAndUpdate(
        { username }, // Query to find the user by username
        {
            fullName, username, role, house
        }, // Updated data
        { new: true } // Return the updated user document
    ).select("-password -refreshToken"); // Exclude sensitive fields

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export {
    registerUser,
    userDetails,
    loginUser,
    logoutUser,
    refreshAccessToken,
    deleteUser,
    getUsernames,
    modifyUser
}