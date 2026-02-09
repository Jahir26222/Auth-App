const userModel = require('../model/user.model')
const express = require('express')
const authRouter = express.Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth.middleware')
const validator = require("validator");
const otpModel = require("../model/otp.model");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");






authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body

    const isUserExist = await userModel.findOne({ email })

    if (isUserExist) {
        return res.status(409).json({
            message: "user already Exists with this email"
        })
    }
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    const hash = crypto.createHash('md5').update(password).digest('hex')
    const user = await userModel.create(
        {
            name,
            email,
            password: hash,
            isVerified: false

        })

    //create otp
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // delete old otp
    await otpModel.deleteMany({ email });

    //save otp in db
    await otpModel.create({ email, otp, expiresAt });

    // send otp mail
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}. It will expire in 5 minutes. Good Luck ✅`
    });

    const token = jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET
    )

    res.cookie('Token', token,
        {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }
    )

    res.status(201).json({
        message: "Registered successfully. OTP sent to email.",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }
    });
})


authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "Email Note found",

        })
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: "Please verify your email first"
        });
    }

    const isPassword = user.password === crypto.createHash("md5").update(password).digest("hex")

    if (!isPassword) {
        return res.status(401).json({
            message: "Wrong Password"
        })
    }

    const token = jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET
    )

    res.cookie('Token', token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })
    res.status(200).json({
        message: "Login Successfully",
        user: { id: user._id, name: user.name, email: user.email }

    })
})


authRouter.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "User data fetched successfully",
        user: req.user
    });
});


authRouter.post('/logout', (req, res) => {
    res.clearCookie("Token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.status(200).json({
        message: "Logout Successfully"
    })
})

authRouter.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Email validation
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        // 2. Generate OTP
        const otp = generateOtp();

        // 3. Expiry time (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 4. Delete old OTP if exists
        await otpModel.deleteMany({ email });

        // 5. Save new OTP in DB
        await otpModel.create({ email, otp, expiresAt });

        // 6. Send mail
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Verification Code",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        });

        res.status(200).json({
            message: "OTP sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});


authRouter.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP required"
            });
        }

        const otpData = await otpModel.findOne({ email });

        if (!otpData) {
            return res.status(404).json({
                message: "OTP not found, please request again"
            });
        }

        // expiry check
        if (otpData.expiresAt < new Date()) {
            await otpModel.deleteOne({ email });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // otp match check
        if (otpData.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // user verified update
        await userModel.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        // otp delete
        await otpModel.deleteOne({ email });

        res.status(200).json({
            message: "OTP verified successfully, account Created ✅"
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});


module.exports = authRouter