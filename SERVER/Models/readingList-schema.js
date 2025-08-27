const mongoose = require('mongoose');

const readingListSchema = new mongoose.Schema({
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
  // An ordered array of book objects, each with a read status
  books: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Books',
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  // Stored progress field for easy and fast filtering/querying
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    index: true // Index for faster queries (e.g., find all completed lists)
  }
}, { timestamps: true });


readingListSchema.methods.calculateAndSaveProgress = async function(options = {}) {
  const totalCount = this.books.length;
  
  if (totalCount === 0) {
    this.progress = 0;
  } else {
    const readCount = this.books.filter(b => b.isRead).length;
    this.progress = Math.round((readCount / totalCount) * 100);
  }

  // Pass the options object (which can contain a session) to the save command
  await this.save(options);
};

readingListSchema.index({ userId: 1, title: 1 }, { unique: true });

const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports = { ReadingList };