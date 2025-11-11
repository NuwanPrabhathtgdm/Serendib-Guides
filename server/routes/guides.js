const express = require('express');
const {
  registerGuide,
  getGuides,
  getGuide,
  getMyGuideProfile
} = require('../controllers/guideController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, registerGuide);
router.get('/', getGuides);
router.get('/me', protect, getMyGuideProfile);
router.get('/:id', getGuide);

module.exports = router;