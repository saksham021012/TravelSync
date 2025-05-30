const express = require("express");
const router = express.Router();
const auth = require("../controllers/Auth");


const {register,
    login,
    logout,
    sendOTP
} = auth;

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); 
router.post("/sendOtp", sendOTP)

module.exports = router;
