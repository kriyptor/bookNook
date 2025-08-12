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
  category: {
    type: String,
    trim: true,
    required: true, // It's good practice to require a category
    enum: [
      'Fiction',
      'Non-Fiction',
      'Spirituality',
      'Philosophy',
      'Biography & Memoir',
      'Literature & Poetry',
      'Sci-Fi & Fantasy',
      'Mystery & Thriller',
      'Self-Help & Personal Development',
      'Business & Finance',
      'History',
      'Arts & Photography',
      'Health & Wellness',
      'Science & Technology',
      'Graphic Novels & Comics',
      'Other' // A default or catch-all category
    ],
    default: 'Other' // Set a sensible default
  },
  imageUrl: {
    type: String,
    trim: true,
    default : 'https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg'
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
  review: {
  type: String,
  enum: ['Transformative','Worthwhile','Uninspiring','Not Rated'],
  default: 'Not Rated'
},
  learnings: {
    summary: { type: String, trim: true, default : '' }, // Replaces old "learnings"
    details: { type: String, trim: true, default : '' }
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

module.exports = { Books };
