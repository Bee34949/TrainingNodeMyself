const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');

// POST /api/upload/avatar — อัปโหลดรูปโปรไฟล์ (ต้อง login)
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({ message: 'Upload successful', avatar: avatarUrl, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
