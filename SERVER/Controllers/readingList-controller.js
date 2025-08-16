const mongoose = require("mongoose");
const {Books} = require('../Models/book-schema');
const {ReadingList} = require('../Models/readingList-schema');

// GET /api/reading-lists - Get all reading lists for a user
exports.getAllReadingLists = async (req, res) => {
  try {
    
    const userId = req.user._id;

     if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user or product ID format" });
    }

    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;
    
    const readingLists = await ReadingList.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);

    if (!readingLists || readingLists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reading lists found'
      });
    }

    // Count total reading lists for pagination
    const totalReadingLists = await ReadingList.countDocuments({ userId });

    const totalPages = Math.ceil(totalReadingLists / limitPointer);

    res.status(200).json({
      success: true,
      data: readingLists,
       pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalReadingLists,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reading lists',
      error: error.message
    });
  }
};



// GET /api/reading-lists/:id - Get a specific reading list
// CORRECTED: exports.getSingleReadingList
exports.getSingleReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID or reading list ID format." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Step 1: Find the list and check ownership to get the total book count FIRST.
    // We only select the 'books' field for efficiency.
    const listForCount = await ReadingList.findOne({ _id: id, userId }).select('books');

    if (!listForCount) {
      return res.status(404).json({ success: false, message: 'Reading list not found or does not belong to the user.' });
    }

    const totalBooks = listForCount.books.length;
    const totalPages = Math.ceil(totalBooks / limit);

    // Step 2: Now, find the same list again but populate it with pagination for the response.
    const readingList = await ReadingList.findById(id) // We already verified ownership, so a simple findById is fine.
      .populate({
        path: 'books',
        options: { skip, limit }
      });

    res.status(200).json({
      success: true,
      data: readingList,
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
      message: 'Error fetching reading list.', 
      error: error.message 
    });
  }
};

// POST /api/reading-lists - Create a new reading list
exports.createReadingList = async (req, res) => {
  // Start a new transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;

    // 1. Validate userId and required fields
    if (!mongoose.isValidObjectId(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }
    
    const { title, description, books = [] } = req.body;

    if (!title || !description) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // 2. Check for an existing list for the user
    const existingList = await ReadingList.findOne({ userId, title }).session(session);
    if (existingList) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'A reading list with this title already exists for this user.'
      });
    }

    // 3. Create books within the transaction if the array is not empty
    let createdBooks = [];
    if (books.length > 0) {
      // Create new book documents with the user ID
      const newBooks = books.map(book => ({
        ...book,
        userId: userId // CRITICAL: Use 'userId' to match the schema
      }));
      createdBooks = await Books.insertMany(newBooks, { session });
    }
    
    // Get the IDs of the newly created books
    const createdBookIds = createdBooks.map(book => book._id);
    
    // 4. Create the new reading list with the book IDs
    const newReadingList = new ReadingList({
      userId,
      title,
      description,
      books: createdBookIds
    });

    const savedReadingList = await newReadingList.save({ session });

    // 5. Populate the saved document before committing the transaction
    const populatedReadingList = await savedReadingList.populate('books');
    
    // 6. Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Reading list created successfully.',
      data: populatedReadingList
    });
  } catch (error) {
    // Abort transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A reading list with this title already exists for this user.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating reading list.',
      error: error.message
    });
  }
};

// PUT /api/reading-lists/:id - Update a reading list
exports.updateReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // 1. Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid user or list ID format" });
    }

    // 2. Validate and prepare update data
    const { title, description } = req.body;
    
    // An update object is dynamically built to only include fields present in the request
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    // If there's no data to update, return a bad request
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided. Please provide a title or description.'
      });
    }

    // 3. Find and update in a single atomic query with ownership check
    const updatedReadingList = await ReadingList.findOneAndUpdate(
      { _id: id, userId: userId }, // Combine ownership check and ID filter
      updateData,
      { new: true, runValidators: true }
    ).populate('books');

    // 4. Check if a document was actually found and updated
    if (!updatedReadingList) {
      return res.status(404).json({
        success: false,
        message: 'Reading list not found or does not belong to the user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reading list updated successfully',
      data: updatedReadingList
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A reading list with this title already exists for this user.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating reading list',
      error: error.message
    });
  }
};


exports.addBookToReadingList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { id: readingListId } = req.params;
    const bookData = req.body;

    // 1. Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(readingListId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Invalid user or reading list ID format" });
    }

    // 2. Find the reading list and check for ownership
    const readingList = await ReadingList.findOne({ _id: readingListId, userId }).session(session);
    if (!readingList) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Reading list not found or does not belong to the user.' });
    }

    // 3. Create the new book and validate required fields
    if (!bookData.title || !bookData.author || !bookData.category) {
       await session.abortTransaction();
       session.endSession();
       return res.status(400).json({ success: false, error: "Title, author, and category are required for a new book." });
    }
    
    // Add userId to the book data
    const newBook = await Books.create([{ ...bookData, userId: userId }], { session });

    // 4. Add the new book's ID to the reading list
    readingList.books.push(newBook[0]._id);
    await readingList.save({ session });

    // 5. Populate the reading list to include the new book's data in the response
    const populatedReadingList = await readingList.populate('books');
    
    // 6. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Book created and added to reading list successfully.',
      data: populatedReadingList
    });

  } catch (error) {
    // 7. Abort transaction on any error
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A duplicate entry was found in the database.' });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating and adding book to reading list.',
      error: error.message
    });
  }
};

exports.removeBookFromReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: readingListId } = req.params;
    const { bookId } = req.body;

    // Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(readingListId) || !mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    
    // Find and update the reading list with ownership check
    const updatedReadingList = await ReadingList.findOneAndUpdate(
      { _id: readingListId, userId: userId },
      { $pull: { books: bookId } }, // $pull removes the specified item from the array
      { new: true, runValidators: true }
    ).populate('books');

    if (!updatedReadingList) {
      return res.status(404).json({ success: false, message: 'Reading list not found or does not belong to the user.' });
    }

    res.status(200).json({
      success: true,
      message: 'Book removed from reading list successfully',
      data: updatedReadingList
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing book from reading list',
      error: error.message
    });
  }
};


// DELETE /api/reading-lists/:id - Delete a reading list
exports.deleteReadingList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid user or list ID format" });
    }

    // Find the reading list with an ownership check
    const readingList = await ReadingList.findOne({ _id: id, userId });

    if (!readingList) {
      return res.status(404).json({ success: false, message: 'Reading list not found or does not belong to the user.' });
    }

    // Delete the reading list itself
   const result = await ReadingList.deleteOne({ _id: id });

    // Check if a document was actually deleted
  if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reading list not found or does not belong to the user.' 
      });
}

    res.status(200).json({
      success: true,
      message: 'Reading list deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting reading list',
      error: error.message
    });
  }
};

exports.deleteReadingWithBooksList = async (req, res) => {
  // 1. Start a new transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { id } = req.params;

    // 2. Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: "Invalid user or list ID format" });
    }

    // 3. Find the reading list with an ownership check
    const readingList = await ReadingList.findOne({ _id: id, userId }).session(session);

    if (!readingList) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Reading list not found or does not belong to the user.' });
    }

    // 4. Delete all books in the list
    if (readingList.books.length > 0) {
      // Use the deleteMany() method to remove all books by their IDs
      await Books.deleteMany({ _id: { $in: readingList.books } }).session(session);
    }

    // 5. Delete the reading list itself
    await ReadingList.deleteOne({ _id: id }).session(session);

    // 6. Commit the transaction if all operations were successful
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Reading list and associated books deleted successfully.'
    });

  } catch (error) {
    // 7. Abort the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: 'Error deleting reading list and associated books.',
      error: error.message
    });
  }
};
