const mongoose = require("mongoose");
const { Books } = require('../Models/book-schema');
const { ReadingList } = require('../Models/readingList-schema');


exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    // Run all queries in parallel for better performance
    const [
      bookStats,
      readingListStats,
      authorStats,
      categoryStats
    ] = await Promise.all([
      // Book statistics aggregation
      Books.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalBooks: { $sum: 1 },
            booksRead: {
              $sum: { $cond: [{ $eq: ["$status", "Read"] }, 1, 0] }
            },
            booksYetToRead: {
              $sum: { $cond: [{ $eq: ["$status", "To Read"] }, 1, 0] }
            },
            booksOngoing: {
              $sum: { $cond: [{ $eq: ["$status", "Reading"] }, 1, 0] }
            },
            totalCost: { $sum: "$price" }
          }
        }
      ]),

      // Reading list statistics aggregation
      ReadingList.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalReadingLists: { $sum: 1 },
            completedReadingLists: {
              $sum: { $cond: [{ $eq: ["$progress", 100] }, 1, 0] }
            },
            yetToCompleteLists: {
              $sum: { $cond: [{ $eq: ["$progress", 0] }, 1, 0] }
            },
            ongoingReadingLists: {
              $sum: { 
                $cond: [
                  { $and: [{ $gt: ["$progress", 0] }, { $lt: ["$progress", 100] }] }, 
                  1, 
                  0
                ] 
              }
            }
          }
        }
      ]),

      // Most read author
      Books.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(userId),
            status: "Read"
          } 
        },
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),

      // Most read category
      Books.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(userId),
            status: "Read"
          } 
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    // Format response data
    const dashboardData = {
      bookStats: {
        totalBooks: bookStats[0]?.totalBooks || 0,
        booksRead: bookStats[0]?.booksRead || 0,
        booksYetToRead: bookStats[0]?.booksYetToRead || 0,
        booksOngoing: bookStats[0]?.booksOngoing || 0,
        totalCost: bookStats[0]?.totalCost || 0,
        mostReadAuthor: authorStats[0]?._id || 'None',
        mostReadCategory: categoryStats[0]?._id || 'None'
      },
      readingListStats: {
        totalReadingLists: readingListStats[0]?.totalReadingLists || 0,
        completedReadingLists: readingListStats[0]?.completedReadingLists || 0,
        yetToCompleteLists: readingListStats[0]?.yetToCompleteLists || 0,
        ongoingReadingLists: readingListStats[0]?.ongoingReadingLists || 0
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};