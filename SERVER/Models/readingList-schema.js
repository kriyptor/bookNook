const mongoose = require('mongoose');

/**
 * =============================================================================
 * READING LIST SCHEMA
 * =============================================================================
 * Defines a reading list, which is an ordered collection of books.
 * Includes all fields for sharing, cloning, and public visibility.
 */
const readingListSchema = new mongoose.Schema({
  // Link to the user who owns this reading list
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // An ordered array that will store the IDs of books in this list
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books'
  }],

  // --- Optional Sharing and Collaboration Fields ---

 /*  // For making the list discoverable by other users in the app
  isPublic: {
    type: Boolean,
    default: false
  },

  // For sharing with anyone via a direct link
  isShareable: {
    type: Boolean,
    default: false
  },
  shareableId: {
    type: String,
    default: () => nanoid(12), // Generates a 12-character unique ID
    unique: true,
    index: true
  },

  // To track where a cloned list originated from
  clonedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingList',
    default: null
  } */
}, { timestamps: true });


// Create an index for faster lookups by user and title
readingListSchema.index({ userId: 1, title: 1 }, { unique: true });

const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports = { ReadingList };
