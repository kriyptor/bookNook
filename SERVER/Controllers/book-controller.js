const Books = require('../Models/book-schema');


const getSingleBookData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; 

    // Combine validation into a single, robust check
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    const book = await Books.findOne({ _id: id, userId });
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user'
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


// GET /api/books - Get all books for a user
exports.getAllBooks = async (req, res) => {
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
      review, // Destructure the review object
      // Note: 'learnings' from your old schema is now 'review' in the new schema
    } = req.body;

    // Validate required fields
    if (!title || !author || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, author, and category are required"
      });
    }

    // Build the book data object dynamically, including the userId
    const bookData = {
      user: userId, // CRITICAL: Link the book to the authenticated user
      title,
      author,
      category
    };

    if (purchaseUrl) bookData.purchaseUrl = purchaseUrl;
    if (price) bookData.price = price;
    if (description) bookData.description = description;
    if (imageUrl) bookData.imageUrl = imageUrl;
    if (status) bookData.status = status;
    if (isFavorite !== undefined) bookData.isFavorite = isFavorite; // Handle boolean explicitly
    
    // Handle the review data according to your schema
    if (review) {
      bookData.review = {
        summary: review.summary,
        details: review.details,
      };
    }
    
    // Create and save the new book in a single step
    const book = new Books(bookData);
    const savedBook = await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook // Use the savedBook object directly
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


exports.updateBookStatusToReadAndLearnings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // Use 'id' for consistency
    const { summary, details, rating } = req.body; // Use 'rating' to match schema
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    // Combine validation into a single, clean check
    if (!summary || !details || !rating) {
        return res.status(400).json({ success: false, error: "All fields (summary, details, rating) are required." });
    }

    const updateData = {
        'review.summary': summary,
        'review.details': details,
        status: 'Read',
        rating: rating,
        finishedOn: new Date() // Add the finishedOn date
    };

    const updatedBook = await Books.findOneAndUpdate(
      { _id: id, userId: userId }, // Atomic query with ownership check
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user.'
      });
    }

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
exports.toggleBookStatusToReading = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // Use 'id' for consistency

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }
    
    const updatedBook = await Books.findOneAndUpdate(
      { _id: id, userId: userId },
      [ 
        { 
          $set: { 
            status: { 
              $cond: {
                if: { $eq: ["$status", "To Read"] },
                then: "Reading",
                else: "To Read"
              }
            } 
          }
        } 
      ],
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Book status updated to '${updatedBook.status}'.`,
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
    const { id } = req.params; // Using 'id' for consistency with route params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    // Atomically find the book, toggle the isFavorite status, and return the updated document
    const updatedBook = await Books.findOneAndUpdate(
      { _id: id, userId: userId },
      [ { $set: { isFavorite: { $not: "$isFavorite" } } } ],
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user'
      });
    }

    res.status(200).json({
      success: true,
      message: `Book ${updatedBook.isFavorite ? 'added to' : 'removed from'} favorites`,
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



/* 
By using a transaction, you prevent a scenario where a book is deleted but 
remains as a dangling reference in a reading list. 
If any part of the deletion fails, the entire operation is rolled back.
*/

// DELETE /api/books/:id - Delete a book
const deleteBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { id } = req.params; // Use 'id' for consistency with route params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    // 1. Delete the book and check for ownership in a single, atomic query.
    const deletedBook = await Books.findOneAndDelete({ _id: id, userId: userId }).session(session);
    
    if (!deletedBook) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user.'
      });
    }

    // 2. Remove the book's ID from all reading lists that contain it.
    await ReadingList.updateMany(
      { books: id },
      { $pull: { books: id } }
    ).session(session);

    // 3. Commit the transaction if all operations were successful
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Book and its references in reading lists deleted successfully.'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
};