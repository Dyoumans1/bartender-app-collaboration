const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide ingredient name'],
        trim: true
    },
    quantity: {
        type: String,
        required: [true, 'Please provide quantity'],
        trim: true
    },
    unit: {
        type: String,
        trim: true
    }
});

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'PLease add comment content'],
        maxlength: [500, 'Comment cannot exceed 500 characters']
     },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating']
        },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
    },

    {timestamps: true }
);

const CocktailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    ingredients: {
        type: [IngredientSchema],
        required: [true, 'Please add ingredients']
    },
    instructions: {
        type: String,
        required: [true, 'Please add instructions']
    },
    glassType: { 
        type: String, 
        default: 'Rocks Glass',
        trim: true 
      },
    imageUrl: {
        type: String,
        defualt: 'default-cocktail.png'
    },
    tags: {
        type: [String]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [CommentSchema]
},
    { timestamps: true }
);

module.exports = mongoose.model('Cocktail', CocktailSchema);