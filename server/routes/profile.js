const express = require("express");
const router = express.Router();

const {
  updateProfile,
  getProfile,
  updateDisplayPicture,
  deleteAccount,
} = require("../controllers/Profile");

const authMiddleware = require("../middlewares/auth");
//PUT /api/profile/update
router.put("/update", authMiddleware, updateProfile);

//GET /api/profile/me
router.get("/me", authMiddleware, getProfile);

//PUT /api/profile/update-dp
router.put("/update-dp", authMiddleware, updateDisplayPicture);

//DELETE /api/profile/delete

router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;
