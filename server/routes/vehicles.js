const express = require('express');
const {
  registerVehicle,
  getVehicles,
  getVehicle,
  getMyVehicleProfile,
  getVehiclesByType
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, registerVehicle);
router.get('/', getVehicles);
router.get('/me', protect, getMyVehicleProfile);
router.get('/type/:vehicleType', getVehiclesByType);
router.get('/:id', getVehicle);

module.exports = router;