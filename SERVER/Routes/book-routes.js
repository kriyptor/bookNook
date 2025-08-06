const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  toggleFavorite
} = require('../Controllers/book-controller');

// GET /api/books/:userId - Get all books for a user (with optional filters)
router.get('/:userId', getBooks);

// GET /api/books/book/:id - Get a specific book
router.get('/book/:id', getBook);

// POST /api/books - Create a new book
router.post('/', createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', deleteBook);

// PUT /api/books/:id/status - Update book reading status
router.put('/:id/status', updateBookStatus);

// PUT /api/books/:id/favorite - Toggle favorite status
router.put('/:id/favorite', toggleFavorite);

module.exports = router;
