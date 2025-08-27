import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import BookCard from '../BookCard';
import EditBookModal from '../EditBookModal';
import DeleteBookModal from './DeleteBookModal';
import AddBookToListModal from './AddBookToListModal';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SingleReadingListPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  
  // Core data states
  const [readingList, setReadingList] = useState(null);
  const [books, setBooks] = useState([]);
  const [progress, setProgress] = useState({
    totalBooks: 0,
    readBooks: 0,
    unreadBooks: 0,
    percentage: 0
  });
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchReadingList = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const userToken = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/reading-lists/list/${listId}?page=${page}&limit=3`, {
        headers: { 'Authorization': userToken }
      });

      if (response.data.success) {
        const { data, pagination: paginationData } = response.data;
        
        setReadingList({
          _id: data._id,
          title: data.title,
          description: data.description,
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
        
        setBooks(data.books);
        setProgress(data.readingProgress);
        setPagination(paginationData);
        setCurrentPage(page);
      } else {
        setError(response.data.message || 'Failed to fetch reading list details.');
      }
    } catch (err) {
      console.error('Error fetching reading list:', err);
      setError('Failed to fetch reading list details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (bookId, newStatus, isRemoval = false) => {
    const bookItem = books.find(b => b.book._id === bookId);
    const wasRead = bookItem?.isRead;
    const willBeRead = newStatus === 'Read';
    
    setProgress(prev => {
      let readBooks = prev.readBooks;
      let totalBooks = prev.totalBooks;
      
      if (isRemoval) {
        totalBooks -= 1;
        if (wasRead) readBooks -= 1;
      } else {
        if (!wasRead && willBeRead) readBooks += 1;
        else if (wasRead && !willBeRead) readBooks -= 1;
      }
      
      readBooks = Math.max(0, readBooks);
      totalBooks = Math.max(0, totalBooks);
      const unreadBooks = totalBooks - readBooks;
      const percentage = totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;
      
      return { totalBooks, readBooks, unreadBooks, percentage };
    });
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleStatusUpdate = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleUpdateBookStatus = async (bookId, updatedData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) throw new Error('No authentication token found. Please sign in.');

      const endpoint = updatedData.status === 'Reading' 
        ? `${BASE_URL}/books/${bookId}/reading`
        : `${BASE_URL}/books/${bookId}/read`;

      const payload = updatedData.status === 'Read' 
        ? { summary: updatedData.summary, details: updatedData.details, rating: updatedData.rating }
        : { status: updatedData.status };

      const response = await axios.put(endpoint, payload, {
        headers: { 'Authorization': userToken }
      });
      const updatedBookData = response.data.data;

      updateProgress(bookId, updatedData.status);

      setBooks(prevBooks => 
        prevBooks.map(bookItem => 
          bookItem.book._id === bookId 
            ? { ...bookItem, book: updatedBookData, isRead: updatedData.status === 'Read' }
            : bookItem
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating book:', err);
      setUpdateError(err.response?.data?.message || 'Failed to update book. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleConfirmDelete = async (bookId, type) => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      const userToken = localStorage.getItem('token');
      
      console.log(bookId, type) 

      if (type === 'delete') {
        await axios.delete(`${BASE_URL}/books/${bookId}`, {
          headers: { 'Authorization': userToken }
        });
      } else {
        await axios.delete(`${BASE_URL}/reading-lists/${listId}/books/${bookId}`, {
          headers: { 'Authorization': userToken }
        });
      }
      
      updateProgress(bookId, null, true);

      const prevBooksLength = books.length;
      setBooks(prevBooks => prevBooks.filter(bookItem => bookItem.book._id !== bookId));

      setPagination(prev => {
        const newTotalItems = prev.totalItems - 1;
        const limit = 3;
        const newTotalPages = Math.ceil(newTotalItems / limit);
        return {
          ...prev,
          totalItems: newTotalItems,
          totalPages: newTotalPages,
          hasNextPage: currentPage < newTotalPages,
          hasPrevPage: currentPage > 1
        };
      });

      setShowDeleteModal(false);
      setBookToDelete(null);
      
      // Refresh if current page becomes empty
      if (prevBooksLength === 1 && currentPage > 1) {
        fetchReadingList(currentPage - 1);
      } else if (prevBooksLength === 1) {
        fetchReadingList(1);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      setUpdateError('Failed to delete book. Please try again later.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddBooks = async (booksToAdd) => {
    if (booksToAdd.length === 0) return;
    
    setUpdateLoading(true);
    setUpdateError(null);
    
    try {
      const userToken = localStorage.getItem('token');
      
      await axios.put(`${BASE_URL}/reading-lists/${listId}/books`, {
       books: booksToAdd
      }, {
        headers: { 'Authorization': userToken }
      });
      
      fetchReadingList(currentPage);
    } catch (err) {
      console.error('Error adding books:', err);
      setUpdateError('Failed to add books. Please try again later.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      fetchReadingList(page);
    }
  };

  useEffect(() => {
    fetchReadingList();
  }, [listId]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  if (!readingList) {
    return (
      <Container className="my-5">
        <Alert variant="info">No reading list found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Enhanced Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-start mb-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)} 
              className="me-3 rounded-pill flex-shrink-0"
            >
              Back
            </Button>
            <div className="flex-grow-1">
              <h1 className="h2 mb-2 text-primary fw-bold">{readingList.title}</h1>
              <p className="text-muted mb-0 lead">{readingList.description}</p>
            </div>
          </div>
          
          {/* Progress Section */}
          <Row className="mt-4">
            <Col lg={8} className="mb-3 mb-lg-0">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-semibold text-secondary">Reading Progress</span>
                <span className="badge bg-primary fs-6">
                  {progress.percentage}% Complete
                </span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progress.percentage}%` }}
                  aria-valuenow={progress.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </Col>
            <Col lg={4}>
              <Row className="text-center">
                <Col xs={6}>
                  <div className="border-end">
                    <div className="h4 mb-1 text-success fw-bold">
                      {progress.readBooks}
                    </div>
                    <small className="text-muted">Books Read</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="h4 mb-1 text-primary fw-bold">
                    {progress.totalBooks}
                  </div>
                  <small className="text-muted">Total Books</small>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          Books in this List (Page {currentPage} of {pagination.totalPages})
        </h4>
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="rounded-pill">
          Add Book
        </Button>
      </div>
      
      {books.length === 0 ? (
        <Alert variant="info" className="rounded-pill">
          No books in this reading list yet.
        </Alert>
      ) : (
        <>
          <Row xs={1} sm={2} lg={3} className="g-4 mb-4">
            {books.map((bookItem) => (
              <Col key={bookItem.book._id}>
                <BookCard
                  title={bookItem.book.title}
                  author={bookItem.book.author}
                  status={bookItem.book.status}
                  imageUrl={bookItem.book.imageUrl}
                  onEditDetails={() => handleEditClick(bookItem.book)}
                  onUpdateStatus={() => handleStatusUpdate(bookItem.book)}
                  onDelete={() => handleDeleteClick(bookItem.book)}
                />
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                />
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
      
      <EditBookModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setUpdateError(null);
        }}
        book={selectedBook}
        onUpdate={handleUpdateBookStatus}
        updateLoading={updateLoading}
        updateError={updateError}
      />
      
      <DeleteBookModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setUpdateError(null);
        }}
        bookId={bookToDelete?._id}
        onConfirmDelete={handleConfirmDelete}
        loading={updateLoading}
        error={updateError}
      />
      
      <AddBookToListModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddBooks}
      />
    </Container>
  );
};

export default SingleReadingListPage;