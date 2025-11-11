const Guide = require('../models/Guide');
const User = require('../models/User');

// @desc    Register as a guide
// @route   POST /api/guides/register
// @access  Private
const registerGuide = async (req, res) => {
  try {
    const {
      guideId,
      experience,
      languages,
      specialties,
      bio,
      hourlyRate,
      dailyRate,
      locations
    } = req.body;

    // Check if guide ID already exists
    const guideExists = await Guide.findOne({ guideId });
    if (guideExists) {
      return res.status(400).json({
        success: false,
        message: 'Guide ID already registered'
      });
    }

    // Check if user already has a guide profile
    const existingGuide = await Guide.findOne({ user: req.user.id });
    if (existingGuide) {
      return res.status(400).json({
        success: false,
        message: 'You already have a guide profile'
      });
    }

    // Create guide profile
    const guide = await Guide.create({
      user: req.user.id,
      guideId,
      experience,
      languages,
      specialties: specialties || [],
      bio,
      hourlyRate,
      dailyRate,
      locations: locations || []
    });

    // Update user role to guide
    await User.findByIdAndUpdate(req.user.id, { role: 'guide' });

    res.status(201).json({
      success: true,
      message: 'Guide profile created successfully',
      data: guide
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all guides
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ isAvailable: true })
      .populate('user', 'name email phone profilePhoto')
      .select('-idDocument');

    res.json({
      success: true,
      count: guides.length,
      data: guides
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single guide
// @route   GET /api/guides/:id
// @access  Public
const getGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('user', 'name email phone profilePhoto')
      .select('-idDocument');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my guide profile
// @route   GET /api/guides/me
// @access  Private
const getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id })
      .populate('user', 'name email phone profilePhoto');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'No guide profile found'
      });
    }

    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerGuide,
  getGuides,
  getGuide,
  getMyGuideProfile
};