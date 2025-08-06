const express = require('express');
const router = express.Router();
const {
  getReadingLists,
  getReadingList,
  createReadingList,
  updateReadingList,
  deleteReadingList,
  updateReadingListBooks
} = require('../Controllers/readingList-controller');

// GET /api/reading-lists/:userId - Get all reading lists for a user
router.get('/:userId', getReadingLists);

// GET /api/reading-lists/list/:id - Get a specific reading list
router.get('/list/:id', getReadingList);

// POST /api/reading-lists - Create a new reading list
router.post('/', createReadingList);

// PUT /api/reading-lists/:id - Update a reading list
router.put('/:id', updateReadingList);

// DELETE /api/reading-lists/:id - Delete a reading list
router.delete('/:id', deleteReadingList);

// PUT /api/reading-lists/:id/books - Add/Remove books from reading list
router.put('/:id/books', updateReadingListBooks);

module.exports = router;
