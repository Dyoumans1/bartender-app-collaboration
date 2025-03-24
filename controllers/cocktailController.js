const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Cocktail = require("../models/cocktail.js");
const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const cocktail = await Cocktail.create(req.body);
        cocktail._doc.author = req.user;
        res.status(201).json(cocktail);
    } catch (err) {
        res.status(500).json({ err: err.message});
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const cocktails = await Cocktail.find({}).populate("author").sort({ createdAt: "desc" });
        res.status(200).json(cocktails);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// localhost:3000/cocktails/search?name=example%20
router.get('/search', verifyToken, async (req, res) => {
    try {
        const {name} = req.query
        const cocktails = await Cocktail.find({name: name}).populate("author").sort({ createdAt: "desc" });
        res.status(200).json(cocktails);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});



router.get('/:cocktailId', verifyToken, async (req,res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.cocktailId).populate(['author', 'comments.author']);
        res.status(200).json(cocktail);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});



router.put('/:cocktailId', verifyToken, async (req,res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.cocktailId);

        if(!cocktail.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const updatedCocktail = await Cocktail.findByIdAndUpdate(
            req.params.cocktailId,
            req.body,
            { new: true }
        );
        updatedCocktail._doc.author = req.user;
        res.status(200).json(updatedCocktail);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


router.delete("/:cocktailId", verifyToken, async (req, res) => {
    try {
      const cocktail = await Cocktail.findById(req.params.cocktailId);
  
      if (!cocktail.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedCocktail = await Cocktail.findByIdAndDelete(req.params.cocktailId);
      res.status(200).json(deletedCocktail);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

  router.post("/:cocktailId/comments", verifyToken, async (req, res) => {
    try {
       
    const { rating, content } = req.body;
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      req.body.author = req.user._id;
      const cocktail = await Cocktail.findById(req.params.cocktailId);
      cocktail.comments.push({ rating, content, author: req.user._id });
      await cocktail.save();
  
      const newComment = cocktail.comments[cocktail.comments.length - 1];
  
      newComment._doc.author = req.user;
  
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

  router.delete('/:cocktailId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.cocktailId);
        if (!cocktail) {
            return res.status(404).json({ message: "Cocktail not found" });
        }
        const commentIndex = cocktail.comments.findIndex(
            comment => comment._id.toString() === req.params.commentId
        );

        if (!cocktail.comments[commentIndex].author.equals(req.user._id)) {
            return res.status(403).json({ message: "You're not allowed to delete this comment" });
        }
        cocktail.comments.splice(commentIndex, 1);
        await cocktail.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ err: err.message });
    }
  });

  module.exports = router;
