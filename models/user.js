const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [5, 'Username cannot be less than 5 characters'],
    maxLength: [25, 'Username cannot be more than 25 characters'],
    trim: true
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },

});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

module.exports = mongoose.model('User', userSchema);
