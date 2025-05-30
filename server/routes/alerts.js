const express = require('express');
const router = express.Router();
const alertController = require("../controllers/Alerts.js");
const authMiddleware = require("../middlewares/auth.js");



const {getAlertsByTrip, deleteAlertById, deleteAlertsByTrip} = alertController;


router.get('/trip/:tripId',authMiddleware, getAlertsByTrip);
router.delete('/:alertId', authMiddleware, deleteAlertById);
router.delete('/trip/:tripId', authMiddleware, deleteAlertsByTrip);

module.exports = router;


module.exports = router;