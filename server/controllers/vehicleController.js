const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// @desc    Register a vehicle
// @route   POST /api/vehicles/register
// @access  Private
const registerVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      vehicleModel,
      vehicleYear,
      licensePlate,
      capacity,
      amenities,
      hourlyRate,
      dailyRate,
      driverName,
      driverPhone,
      locations
    } = req.body;

    // Check if license plate already exists
    const vehicleExists = await Vehicle.findOne({ licensePlate });
    if (vehicleExists) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this license plate already registered'
      });
    }

    // Check if user already has a vehicle profile
    const existingVehicle = await Vehicle.findOne({ user: req.user.id });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'You already have a vehicle profile'
      });
    }

    // Create vehicle profile
    const vehicle = await Vehicle.create({
      user: req.user.id,
      vehicleType,
      vehicleModel,
      vehicleYear,
      licensePlate: licensePlate.toUpperCase(),
      capacity,
      amenities: amenities || [],
      hourlyRate,
      dailyRate,
      driverName,
      driverPhone,
      locations: locations || []
    });

    // Update user role to vehicle-owner
    await User.findByIdAndUpdate(req.user.id, { role: 'vehicle-owner' });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      data: vehicle
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isAvailable: true })
      .populate('user', 'name email phone profilePhoto');

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('user', 'name email phone profilePhoto');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my vehicle profile
// @route   GET /api/vehicles/me
// @access  Private
const getMyVehicleProfile = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ user: req.user.id })
      .populate('user', 'name email phone profilePhoto');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'No vehicle profile found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicles by type
// @route   GET /api/vehicles/type/:vehicleType
// @access  Public
const getVehiclesByType = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ 
      vehicleType: req.params.vehicleType,
      isAvailable: true 
    }).populate('user', 'name email phone profilePhoto');

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerVehicle,
  getVehicles,
  getVehicle,
  getMyVehicleProfile,
  getVehiclesByType
};