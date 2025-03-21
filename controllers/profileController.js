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

router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if(!user._id.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    updatedUser.username = req.userId;
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;