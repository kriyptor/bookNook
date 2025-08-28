const mongoose = require('mongoose');
const {Books} = require('../Models/book-schema');
const {ReadingList} = require('../Models/readingList-schema'); 


exports.getSingleBookData = async (req, res) => {
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


// GET /api/books - Get all books for a user with optional filtering
exports.getAllBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    // ISSUE 1 FIXED: All filters are now correctly taken from req.query
    const { status, category, isFavorite, review, search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    
    // The base filter ensures users can only see their own books
    let filter = { userId };
    
    // --- Build the Filter Object Dynamically ---
    if (status) filter.status = status;
    //if (category) filter.category = category;
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    // ISSUE 2 FIXED: Filtering by the 'review' field (the enum)
    if (review) filter.review = review;
    
    // BONUS: A robust text search for title, author, and review text
    if (search) {
        filter.$or = [
            { 'title': { $regex: search, $options: 'i' } },
            { 'author': { $regex: search, $options: 'i' } },
            /* { 'review.summary': { $regex: search, $options: 'i' } },
            { 'review.details': { $regex: search, $options: 'i' } } */
        ];
    }

    // --- Execute Queries ---
    // Using Promise.all to run count and find queries concurrently for better performance
    const [books, totalBooks] = await Promise.all([
        Books.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Books.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalBooks / limit);  
    
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
exports.createBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const { booksToCreate } = req.body;
    console.log(booksToCreate)
    // Validate input is an array
    if (!Array.isArray(booksToCreate) || booksToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        error: "booksToCreate must be a non-empty array"
      });
    }

    const validCategories = [
      "Fiction", "Non-Fiction", "Spirituality", "Philosophy",
      "Biography & Memoir", "Literature & Poetry", "Sci-Fi & Fantasy",
      "Mystery & Thriller", "Self-Help & Personal Development",
      "Business & Finance", "History", "Arts & Photography",
      "Health & Wellness", "Science & Technology",
      "Graphic Novels & Comics", "Other"
    ];

    const createdBooks = [];
    const errors = [];

    for (let i = 0; i < booksToCreate.length; i++) {
      const bookInput = booksToCreate[i];
      
      try {
        const {
          title, author, purchaseUrl, price, description,
          category, imageUrl, status, isFavorite, learnings
        } = bookInput;

        // Validate required fields
        if (!title || !author || !category) {
          errors.push({
            index: i,
            error: "Title, author, and category are required",
            book: { title, author }
          });
          continue;
        }

        // Validate category
        if (!validCategories.includes(category)) {
          errors.push({
            index: i,
            error: "Invalid category",
            book: { title, author }
          });
          continue;
        }

        // Build book data
        const bookData = { userId, title, author, category };
        
        if (purchaseUrl) bookData.purchaseUrl = purchaseUrl;
        if (price) bookData.price = price;
        if (description) bookData.description = description;
        if (imageUrl) bookData.imageUrl = imageUrl;
        if (status) bookData.status = status;
        if (isFavorite !== undefined) bookData.isFavorite = isFavorite;
        
        if (learnings) {
          bookData.learnings = {
            summary: learnings.summary || '',
            details: learnings.details || ''
          };
        }

        const book = new Books(bookData);
        const savedBook = await book.save();
        createdBooks.push(savedBook);

      } catch (bookError) {
        errors.push({
          index: i,
          error: bookError.message,
          book: { title: bookInput.title, author: bookInput.author }
        });
      }
    }

    // Return response based on results
    if (createdBooks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No books were created',
        errors
      });
    }

    const response = {
      success: true,
      message: `${createdBooks.length} book(s) created successfully`,
      data: createdBooks
    };

    if (errors.length > 0) {
      response.partialSuccess = true;
      response.errors = errors;
      response.message = `${createdBooks.length} book(s) created, ${errors.length} failed`;
    }

    res.status(201).json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating books',
      error: error.message
    });
  }
};

// PUT /api/books/:id - Update a book
exports.updateBookData = async (req, res) => {
  try {

    const userId = req.user._id;
    const { id } = req.params;
    const updateData = req.body;

      if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({ success: false, error: "Invalid book ID format" });
      }

    const existingBook = await Books.findOne({ _id : id, userId });
    
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user._id;
    const { id } = req.params;
    const { summary, details, rating } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid book ID format" });
    }

    if (!summary || !details || !rating) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Update the Book document
    const updatedBook = await Books.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        'learnings.summary': summary,
        'learnings.details': details,
        status: 'Read',
        review: rating,
        finishedOn: new Date()
      },
      { new: true, runValidators: true, session }
    );
    
    if (!updatedBook) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Book not found or does not belong to the user.'
      });
    }

    // Find all reading lists containing this book
    const affectedLists = await ReadingList.find({
      userId: userId,
      'books.book': id
    }).session(session);

    // Update isRead status in reading lists
    await ReadingList.updateMany(
      { userId: userId, 'books.book': id },
      { $set: { 'books.$.isRead': true } },
      { session }
    );

    // Update progress for each affected reading list
    for (const readingList of affectedLists) {
      // Refresh the reading list to get updated books array
      const updatedList = await ReadingList.findById(readingList._id).session(session);
      await updatedList.calculateAndSaveProgress({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully and reading lists synced',
      data: updatedBook
    });

  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({
      success: false,
      message: 'An error occurred, all changes have been rolled back.',
      error: error.message
    });
  } finally {
    session.endSession();
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
exports.toggleFavorite = async (req, res) => {
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
exports.deleteBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { id } = req.params;

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

    // 2. Remove the book from all reading lists that contain it and get affected lists
    const affectedLists = await ReadingList.find({
      books: { $elemMatch: { book: id } }
    }).session(session);

    // Remove book from reading lists
    await ReadingList.updateMany(
      { "books.book": id },
      { $pull: { books: { book: id } } }
    ).session(session);

    // 3. Update progress for all affected reading lists
    for (const readingList of affectedLists) {
      // Refresh the reading list to get updated books array
      const updatedList = await ReadingList.findById(readingList._id).session(session);
      await updatedList.calculateAndSaveProgress({ session });
    }

    // 4. Commit the transaction if all operations were successful
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

// 1) Get only read books
exports.getReadBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = { userId, status: 'Read' };

    const [books, totalBooks] = await Promise.all([
      Books.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Books.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching read books',
      error: error.message
    });
  }
};

// 2) Get books with status "Reading"
exports.getReadingBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = { userId, status: 'Reading' };

    const [books, totalBooks] = await Promise.all([
      Books.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Books.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reading books',
      error: error.message
    });
  }
};

// 3) Get favorite books
exports.getFavoriteBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const filter = { userId, isFavorite: true };

    const [books, totalBooks] = await Promise.all([
      Books.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Books.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite books',
      error: error.message
    });
  }
};