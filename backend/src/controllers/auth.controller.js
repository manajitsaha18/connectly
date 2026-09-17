const userModel = require('../models/user.model');
const { upsertStreamUser } = require('../config/stream');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function RegisterUserController(req, res) {

    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

     
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { email }, { fullName }
            ]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

      
        const idx = Math.floor(Math.random() * 100) + 1;

        const randomAvatar =
            `https://api.dicebear.com/10.x/adventurer/svg?seed=${idx}`;

       
        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            profilePic: randomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for: ${newUser.fullName}`);
        } catch (error) {
            console.error('Error creating Stream user:', error);
        }

        
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

       
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function LoginUserController(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function LogoutUserController(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function GetCurrentUserController(req, res) {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "Current user retrieved successfully",
            user: user
        });
    } catch (error) {
        console.error("Get Current User Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function OnboardUserController(req, res) {
    try {
        const userId = req.user._id;

        const {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            profilePic
        } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                fullName,
                bio,
                nativeLanguage,
                learningLanguage,
                location,
                profilePic,
                isOnboarded: true
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });

            console.log(`Stream user updated for: ${updatedUser.fullName}`);

        } catch (error) {
            console.error("Error updating Stream user:", error);
        }

        return res.status(200).json({
            message: "User onboarded successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Onboard User Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = { RegisterUserController, LoginUserController, LogoutUserController, GetCurrentUserController, OnboardUserController };