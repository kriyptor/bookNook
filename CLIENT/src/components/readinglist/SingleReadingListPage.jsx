import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import BookCard from '../BookCard';
import EditBookModal from '../EditBookModal';
import DeleteBookModal from './DeleteBookModal';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SingleReadingListPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };
  
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = (bookId, type) => {
    console.log(`Deleting book ID ${bookId} with type: ${type}`);
    // This is where you would call your API endpoint
    // For example:
    // if (type === 'delete') {
    //   axios.delete(`/api/books/${bookId}`);
    // } else {
    //   axios.put(`/api/reading-lists/${listId}/remove-book`, { bookId });
    // }
  };

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        setLoading(true);
        setError(null);
        const userToken = localStorage.getItem('token');
        
        const response = await axios.get(`${BASE_URL}/reading-lists/list/${listId}`, {
          headers: {
            'Authorization': userToken
          }
        });

        if (response.data.success) {
          setReadingList(response.data.data);
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
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3 rounded-pill">
          Back
        </Button>
        <div>
          <h2 className="mb-0">{readingList.title}</h2>
          <p className="text-muted mb-0">{readingList.description}</p>
        </div>
      </div>
      <hr />
      
      <h4 className="mb-4">Books in this List ({readingList.books.length})</h4>
      {readingList.books.length === 0 ? (
        <Alert variant="info" className="rounded-pill">
          No books in this reading list yet.
        </Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {readingList.books.map((book) => (
            <Col key={book._id}>
              <BookCard
                title={book.title}
                author={book.author}
                status={book.status}
                imageUrl={book.imageUrl}
                onEdit={() => handleEditClick(book)}
                onDelete={() => handleDeleteClick(book)}
              />
            </Col>
          ))}
        </Row>
      )}
      <EditBookModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        book={selectedBook}
      />
      <DeleteBookModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        bookId={bookToDelete?._id}
        onConfirmDelete={handleConfirmDelete}
      />
    </Container>
  );
};

export default SingleReadingListPage;