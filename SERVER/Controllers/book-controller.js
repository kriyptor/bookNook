const Books = require('../Models/book-schema');

// GET /api/books - Get all books for a user
const getBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, category, isFavorite, rating } = req.query;
    
    let filter = { user: userId };
    
    // Add optional filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';
    if (rating) filter.rating = rating;

    const books = await Book.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

// GET /api/books/:id - Get a specific book
const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id)
      .populate('user', 'name email');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};

// POST /api/books - Create a new book
const createBook = async (req, res) => {
  try {
    const {
      user,
      title,
      author,
      purchaseUrl,
      price,
      description,
      category,
      imageUrl,
      status,
      isFavorite,
      rating,
      review
    } = req.body;

    const book = new Book({
      user,
      title,
      author,
      purchaseUrl,
      price,
      description,
      category,
      imageUrl,
      status,
      isFavorite,
      rating,
      review,
      finishedOn: status === 'Read' ? new Date() : null
    });

    const savedBook = await book.save();
    const populatedBook = await Book.findById(savedBook._id)
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: populatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
};

// PUT /api/books/:id - Update a book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingBook = await Book.findById(id);
    
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Update finishedOn date when status changes to 'Read'
    if (updateData.status === 'Read' && existingBook.status !== 'Read') {
      updateData.finishedOn = new Date();
    } else if (updateData.status !== 'Read') {
      updateData.finishedOn = null;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
};

// DELETE /api/books/:id - Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
};

// PUT /api/books/:id/status - Update book status
const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['To Read', 'Reading', 'Read'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "To Read", "Reading", or "Read"'
      });
    }

    const updateData = { status };
    
    // Set finishedOn date when marking as 'Read'
    if (status === 'Read') {
      updateData.finishedOn = new Date();
    } else {
      updateData.finishedOn = null;
    }

    const book = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book status updated successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book status',
      error: error.message
    });
  }
};

// PUT /api/books/:id/favorite - Toggle favorite status
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book.isFavorite = !book.isFavorite;
    await book.save();

    const updatedBook = await Book.findById(id).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: `Book ${book.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating favorite status',
      error: error.message
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  toggleFavorite
};
