const express = require("express");
const router = express.Router();
const auth = require("../controllers/Auth");
const reset = require("../controllers/ResetPassword")


const {register,
    login,
    logout,
    sendOTP
} = auth;

const {resetPassword,
    resetPasswordToken
} = reset

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); 
router.post("/sendOtp", sendOTP)


//reset password token
router.post("/reset-password-token", resetPasswordToken)

//resetting user's password after verification
router.post("/reset-password", resetPassword)

module.exports = router;


