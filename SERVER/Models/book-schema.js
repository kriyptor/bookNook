const mongoose = require('mongoose');

/**
 * =============================================================================
 * BOOK SCHEMA
 * =============================================================================
 * The core schema for individual book entries. It includes all basic
 * details and optional fields for advanced tracking and organization.
 */
const bookSchema = new mongoose.Schema({
  // Link to the user who owns this book entry
  user: {
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
  author: {
    type: String,
    required: true,
    trim: true
  },
  purchaseUrl: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: { // Can be used as a primary category
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['To Read', 'Reading', 'Read'],
    default: 'To Read'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },

  // --- Optional Advanced Feature Fields ---

  // For personal ratings and reviews
  rating: {
  type: String,
  enum: ['Transformative','Worthwhile','Uninspiring', 'Not Rated'],
  default: 'Not Rated'
},
  review: {
    summary: { type: String, trim: true }, // Replaces old "learnings"
    details: { type: String, trim: true }
  },

 /*  // For tracking reading streaks
  lastReadOn: {
    type: Date,
    default: null
  }, */
  // To log when the book was marked as 'Read'
  finishedOn: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
