import { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Spinner, Alert } from 'react-bootstrap';
import BookCard from './BookCard';
import EditBookModal from './EditBookModal';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReadingBookpage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const userToken = localStorage.getItem('token');

        if (!userToken) {
          throw new Error('No authentication token found. Please sign in.');
        }

        const response = await axios.get(`${BASE_URL}/books/reading?page=${pagination.currentPage}`, {
          headers: {
            'Authorization': userToken
          }
        });

        if (response.data.success) {
          setBooks(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setError(response.data.message || 'Failed to fetch books.');
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message || 'Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pagination.currentPage]);

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, currentPage: pageNumber }));
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleUpdateBook = async (bookId, updatedData) => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        throw new Error('No authentication token found. Please sign in.');
      }

      const endpoint = updatedData.status === 'Reading' 
        ? `${BASE_URL}/books/${bookId}/reading`
        : `${BASE_URL}/books/${bookId}/status`; // Correct endpoint for 'Read' status update

      const payload = updatedData.status === 'Read' 
        ? { 
            summary: updatedData.summary, 
            details: updatedData.details, 
            review: updatedData.rating // Correct field name to match backend
          }
        : { status: updatedData.status };

      const response = await axios.put(endpoint, payload, {
        headers: { 'Authorization': userToken }
      });
      
      const updatedBookData = response.data.data;

      setBooks(prevBooks => 
        prevBooks.map(book => 
          book._id === bookId 
            ? updatedBookData
            : book
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

  const handleDeleteBook = async (bookId) => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        throw new Error('No authentication token found. Please sign in.');
      }

      await axios.delete(`${BASE_URL}/books/${bookId}`, {
        headers: { 'Authorization': userToken }
      });

      // Update the client-side state to remove the deleted book
      setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
      
    } catch (err) {
      console.error('Error deleting book:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete book. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

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
        <Alert variant="danger" className="rounded-pill">{error}</Alert>
      </Container>
    );
  }

  if (books.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info" className="rounded-pill">
          You don't have any books yet. Add some to get started!
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Your Books</h2>
      
      {updateError && (
        <Alert variant="danger" className="rounded-pill" onClose={() => setUpdateError(null)} dismissible>
          {updateError}
        </Alert>
      )}
      {deleteError && (
        <Alert variant="danger" className="rounded-pill" onClose={() => setDeleteError(null)} dismissible>
          {deleteError}
        </Alert>
      )}
      
      <Row xs={1} sm={2} lg={3} className="g-4">
        {books.map((book) => (
          <Col key={book._id}>
            <BookCard
              title={book.title}
              author={book.author}
              status={book.status}
              imageUrl={book.imageUrl}
              onEdit={() => handleEditClick(book)}
              onDelete={() => handleDeleteBook(book._id)}
              deleteLoading={deleteLoading}
            />
          </Col>
        ))}
      </Row>

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev 
              onClick={() => handlePageChange(pagination.currentPage - 1)} 
              disabled={!pagination.hasPrevPage} 
            />
            {[...Array(pagination.totalPages).keys()].map((pageNumber) => (
              <Pagination.Item
                key={pageNumber + 1}
                active={pageNumber + 1 === pagination.currentPage}
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => handlePageChange(pagination.currentPage + 1)} 
              disabled={!pagination.hasNextPage} 
            />
          </Pagination>
        </div>
      )}

      <EditBookModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        book={selectedBook}
        onUpdate={handleUpdateBook}
        updateLoading={updateLoading}
        updateError={updateError}
      />
    </Container>
  );
};

export default ReadingBookpage;