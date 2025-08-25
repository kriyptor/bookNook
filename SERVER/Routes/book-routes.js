const express = require('express');
const router = express.Router();
const { authenticate } = require('../Middleware/auth-middleware');
const bookController = require('../Controllers/book-controller');

// GET /api/books - Get all books for a user (with optional filters)
router.get('/', authenticate, bookController.getAllBooks);

// GET /api/books/book/:id - Get a specific book
router.get('/book/:id', authenticate, bookController.getSingleBookData);

// POST /api/books - Create a new book
router.post('/', authenticate, bookController.createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', authenticate, bookController.updateBookData);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', authenticate, bookController.deleteBook);

// PUT /api/books/:id/status - Update book reading status
router.put('/:id/status', authenticate, bookController.updateBookStatusToReadAndLearnings);

// PUT /api/books/:id/reading - Toggle reading status
router.put('/:id/reading', authenticate, bookController.toggleBookStatusToReading);

// PUT /api/books/:id/favorite - Toggle favorite status
router.put('/:id/favorite', authenticate, bookController.toggleFavorite);

// GET /api/books/read - Get only read books
router.get('/read', authenticate, bookController.getReadBooks);

// GET /api/books/reading - Get books with status "Reading"
router.get('/reading', authenticate, bookController.getReadingBooks);

// GET /api/books/favorites - Get favorite books
router.get('/favorites', authenticate, bookController.getFavoriteBooks);

module.exports = router;
