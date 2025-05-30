const express = require("express");
const router = express.Router();
const emergencyController = require('../controllers/EmergencyController.js');

const {getEmergencyServices} = emergencyController;

router.get('/nearby', getEmergencyServices);

module.exports = router;