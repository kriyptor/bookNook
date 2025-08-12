const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
    // No unique, no index
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Index for faster queries
  },
  password: {
    type: String,
    required: true
  },

  // --- Optional AI Feature Fields ---
/*   encryptedLlmApiKey: {
    type: String, // Store the encrypted key, not the raw key
    default: null
  },
  isAiEnabled: {
    type: Boolean,
    default: false
  }, */

 /*  // --- Optional Reading Goal Fields ---
  readingGoal: {
    type: Number,
    default: 0 // e.g., user wants to read 20 books this year
  },
  goalYear: {
    type: Number,
    default: () => new Date().getFullYear()
  } */

}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

module.exports = { User };
