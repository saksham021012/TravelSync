const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator")


//send otp

exports.sendOTP = async (req, res) => {

    try {
        //fetch email from req body
        const { email } = req.body

        //check if user already exists

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "User already registered"
                })
        }

        //generate otp

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("Otp generated: ", otp);

        //check for unique otp

        let result = await Otp.findOne({ otp: otp })

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await Otp.findOne({ otp: otp })
        }

        const otpPayload = { email, otp };

        //create an entry for otp

        const otpBody = await Otp.create(otpPayload);
        console.log(otpBody)

        //return response successful

        return res.status(200)
            .json({
                success: true,
                message: "OTP sent successfully",
                otp,
            })

    } catch (error) {

        console.log(error);
        return res.status(500)
            .json({
                success: false,
                message: error.message,
            })
    }
}

//register

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, otp } = req.body;

        if (!firstName || !lastName || !email || !password || !otp) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Please enter all the fields"
                })
        }
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User already exists."
                })
        }

        //find most recent otp stored for user

        const recentOtp = await Otp.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length === 0){
            //otp not found 
            return res.status(400).json({
                succesS: false,
                message: "OTP not found"
            })
        }

        //most recent otp
        const otpRecord = recentOtp[0];
        //match otps
        if (otp.toString() !== otpRecord.otp.toString()) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        //hash and store password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await user.save();


        

        return res
            .status(200)
            .json({
                success: true,
                message: "User registered successfully"
            })
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Error registering user", error
            })
    }
}

//login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "All fields are mandatory"
                })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Invalid credentials"
                })
        }

        const token = jwt.sign({ userId: user._id, email: email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
        });

        res.setHeader("Authorization", `Bearer ${token}`);

        return res
            .status(200)
            .json({
                success: true,
                message: "Login Successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                success: false,
                message: "Server error during login",

            });
    }
}

// LOGOUT
exports.logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
};