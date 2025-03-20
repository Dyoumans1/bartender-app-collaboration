const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-token');

const User = require('../models/user');


router.get('/:userId', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.log(error)  
      res.status(500).json({ message: "Server error" });  
    };
});

module.exports = router;