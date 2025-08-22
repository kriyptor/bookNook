import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
// The following package is not a part of react-bootstrap core and needs to be installed.
// import { ArrowLeft } from 'react-bootstrap-icons';

// Mock data to simulate the API response for a single reading list
const mockReadingList = {
  id: "1",
  title: "My Favorites",
  description: "All-time favorite books I would recommend to anyone.",
  books: [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', status: 'Read' },
    { id: 4, title: '1984', author: 'George Orwell', status: 'Reading' },
    { id: 7, title: 'Fahrenheit 451', author: 'Ray Bradbury', status: 'Read' },
    { id: 9, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'Read' },
    { id: 16, title: 'The Alchemist', author: 'Paulo Coelho', status: 'Read' },
  ],
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Reading':
      return 'primary';
    case 'Read':
      return 'success';
    case 'To Read':
      return 'secondary';
    default:
      return 'light';
  }
};

const SingleReadingListPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [readingList, setReadingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        if (listId === mockReadingList.id) {
          setReadingList(mockReadingList);
        } else {
          setError(`Reading list with ID ${listId} not found.`);
        }
      } catch (err) {
        setError("Failed to fetch reading list details.");
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
        {/* The Back Button */}
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3">
          &#8592; Back
        </Button>
        <div>
          <h2 className="mb-0">{readingList.title}</h2>
          <p className="text-muted mb-0">{readingList.description}</p>
        </div>
      </div>
      <hr />
      
      <h4 className="mb-4">Books in this List</h4>
      <Row xs={1} md={2} lg={4} className="g-4">
        {readingList.books.map((book) => (
          <Col key={book.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fs-5">{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{book.author}</Card.Subtitle>
                <div className="mt-3">
                  <span className={`badge bg-${getStatusColor(book.status)}`}>
                    {book.status}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SingleReadingListPage;
