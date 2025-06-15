// routes/
const express = require('express');
const { register, login, getProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
    res.json({ secret: 'This is admin only data.' });
});

module.exports = router;