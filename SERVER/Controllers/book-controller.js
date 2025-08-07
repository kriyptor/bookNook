const Books = require('../Models/book-schema');

// GET /api/books - Get all books for a user
const getBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    const { status, category, isFavorite, rating } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;
    
    let filter = { userId };
    
    // Add optional filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';
    if (rating) filter.rating = rating;

    const books = await Books.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);


     // Count total books for pagination
        const totalBooks = await Books.countDocuments(filter);
    
        const totalPages = Math.ceil(totalBooks / limitPointer);  
    
    res.status(200).json({
      success: true,
      data: books,
       pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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

    const userId = req.user._id;
    const { _id } = req.params;
    
    if(!id) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required'
      });
    }

     if (!mongoose.isValidObjectId(_id)) {
          return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }


    const book = await Books.findOne({ _id, userId })
    
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

    const userId = req.user._id;

    const {
      title,
      author,
      purchaseUrl,
      price,
      description,
      category,
      imageUrl,
      status,
      isFavorite,
      review,
      learnings
    } = req.body;

    if (!title || !author || !category) {
          return res.status(400).json({ success: false, error: "Title, author, and category are required" });
    }

    const bookData = { title, author, category };

    if(price) bookData.price = price;
    if(imageUrl) bookData.imageUrl = imageUrl;
    if(purchaseUrl) bookData.purchaseUrl = purchaseUrl;
    if(description) bookData.description = description;


    const book = new Books(bookData);


    /* const book = new Books({
      userId,
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
    }); */

    const savedBook = await book.save();
    const populatedBook = await Books.findById(savedBook._id)

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
const updateBookData = async (req, res) => {
  try {

    const userId = req.user._id;
    const { _id } = req.params;
    const updateData = req.body;

      if (!mongoose.isValidObjectId(_id)) {
          return res.status(400).json({ success: false, error: "Invalid book ID format" });
      }

    const existingBook = await Books.findOne({ _id, userId });
    
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

   /*  title,
      author,
      purchaseUrl,
      price,
      description,
      category,
      imageUrl,
      status,
      isFavorite,
      rating,
      review, */

    // Update finishedOn date when status changes to 'Read'
   
    const updatedBook = await Books.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

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


const updateBookStatusToReadAndLearnings = async (req, res) => {
  try {

    const userId = req.user._id;
    const { _id } = req.params;
    const { summary, details, review } = req.body;

      if (!mongoose.isValidObjectId(_id)) {
          return res.status(400).json({ success: false, error: "Invalid book ID format" });
      }

      if (!summary || !details || !review) {
          return res.status(400).json({ success: false, error: "All fields are requred" });
      }

      if (!['Transformative','Worthwhile','Uninspiring'].includes(review)) {
          return res.status(400).json({ 
            success: false, 
            error: "Invalid review. Must be 'Transformative', 'Worthwhile', 'Uninspiring'" 
          });
      }

    const existingBook = await Books.findOne({ _id, userId });
    
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const bookData = {}
    
    bookData.learnings = { summary, details };

    if(existingBook.status !== 'Read'){
      bookData.status = 'Read';
      bookData.review = review;
    }

    const updatedBook = await Books.findByIdAndUpdate(
      _id,
      bookData,
      { new: true, runValidators: true }
    )

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



// PUT /api/books/:id/status - Update book status
const toggleBookStatusToReading = async (req, res) => {
  try {

    const userId = req.user._id;
    const { _id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    if (!['To Read', 'Reading'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "To Read", "Reading"'
      });
    }

    const book = await Books.findOne({ _id, userId })
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

  
    const updatedBook = await Books.findByIdAndUpdate(
      _id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book status updated successfully',
      data: updatedBook
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
    
    const userId = req.user._id;
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    const book = await Books.findOne({ _id, userId })

    book.isFavorite = !book.isFavorite;
    await book.save();

    const updatedBook = await Books.findById(_id);

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

// DELETE /api/books/:id - Delete a book
const deleteBook = async (req, res) => {
  try {

    const userId = req.user._id;
    const { _id } = req.params;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json({ success: false, error: "Invalid book ID format" });
      }

    const book = await Books.findOne({ _id, userId })
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await Books.findByIdAndDelete(_id);

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