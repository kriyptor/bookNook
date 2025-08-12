const express = require('express');
const router = express.Router();
const { authenticate } = require('../Middleware/auth-middleware');
const {
  getAllReadingLists, // Corrected name
  getSingleReadingList, // Corrected name
  createReadingList,
  updateReadingList,
  deleteReadingList,
  updateReadingListBooks,
  deleteReadingWithBooksList
} = require('../Controllers/readingList-controller');

// GET /api/reading-lists - Get all reading lists for a user
router.get('/', authenticate, getAllReadingLists);

// GET /api/reading-lists/list/:id - Get a specific reading list
router.get('/list/:id', authenticate, getSingleReadingList);

// POST /api/reading-lists - Create a new reading list
router.post('/', authenticate, createReadingList);

// PUT /api/reading-lists/:id - Update a reading list
router.put('/:id', authenticate, updateReadingList);

// DELETE /api/reading-lists/:id - Delete a reading list
router.delete('/:id', authenticate, deleteReadingList);

// DELETE /api/reading-lists/:id/with-books - Delete a reading list and its books
router.delete('/:id/with-books', authenticate, deleteReadingWithBooksList);

// PUT /api/reading-lists/:id/books - Add/Remove books from reading list
router.put('/:id/books', authenticate, updateReadingListBooks);

module.exports = router;