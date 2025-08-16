import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Modal, Form, FormControl, FormLabel } from 'react-bootstrap';

// Mock data for 20 books (added mock summary/details for testing the modal)
const mockBooks = [
  { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', status: 'Reading', summary: '', details: '' },
  { id: 2, title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', status: 'To Read', summary: '', details: '' },
  { id: 3, title: 'Dune', author: 'Frank Herbert', status: 'Read', summary: 'A complex sci-fi epic about politics and religion on a desert planet.', details: 'Learned about the long-term impacts of political decisions on ecology and culture.' },
  { id: 4, title: '1984', author: 'George Orwell', status: 'Reading', summary: '', details: '' },
  { id: 5, title: 'Brave New World', author: 'Aldous Huxley', status: 'To Read', summary: '', details: '' },
  { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'Read', summary: 'A tale of a hobbit who joins a quest to reclaim a dragon\'s treasure.', details: 'The importance of courage in the face of overwhelming odds.' },
  { id: 7, title: 'Fahrenheit 451', author: 'Ray Bradbury', status: 'Reading', summary: '', details: '' },
  { id: 8, title: 'The Catcher in the Rye', author: 'J.D. Salinger', status: 'To Read', summary: '', details: '' },
  { id: 9, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'Read', summary: 'A story about racial injustice and the loss of innocence in the American South.', details: 'Gained a deeper understanding of empathy and moral courage.' },
  { id: 10, title: 'Pride and Prejudice', author: 'Jane Austen', status: 'Reading', summary: '', details: '' },
  { id: 11, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'To Read', summary: '', details: '' },
  { id: 12, title: 'Moby Dick', author: 'Herman Melville', status: 'Read', summary: 'The obsessive quest of Captain Ahab for revenge on the giant white whale.', details: 'The dangers of obsession and the struggle between good and evil.' },
  { id: 13, title: 'War and Peace', author: 'Leo Tolstoy', status: 'Reading', summary: '', details: '' },
  { id: 14, title: 'The Odyssey', author: 'Homer', status: 'To Read', summary: '', details: '' },
  { id: 15, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', status: 'Read', summary: 'A young wizard discovers his magical heritage and battles an evil sorcerer.', details: 'The power of friendship and bravery.' },
  { id: 16, title: 'The Alchemist', author: 'Paulo Coelho', status: 'Reading', summary: '', details: '' },
  { id: 17, title: 'The Da Vinci Code', author: 'Dan Brown', status: 'To Read', summary: '', details: '' },
  { id: 18, title: 'The Silent Patient', author: 'Alex Michaelides', status: 'Read', summary: 'A psychotherapist tries to unravel the mystery of a famous painter who killed her husband.', details: 'The complex nature of trauma and the secrets people keep.' },
  { id: 19, title: 'Educated', author: 'Tara Westover', status: 'Reading', summary: '', details: '' },
  { id: 20, title: 'Becoming', author: 'Michelle Obama', status: 'To Read', summary: '', details: '' },
];

// Default book cover image URL
const defaultBookCover = "https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg";

// Helper function to get the status color
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

const EditBookModal = ({ show, onHide, book }) => {
  // Use state to manage form data, initialized with the book prop
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: '',
    summary: '',
    details: ''
  });

  // Effect to update form data when a new book is selected
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        status: book.status,
        summary: book.summary || '', // Use empty string for safety
        details: book.details || ''
      });
    }
  }, [book]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle saving the form (mock function)
  const handleSave = () => {
    console.log("Saving changes:", formData);
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Book Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <FormLabel>Book Title</FormLabel>
            <FormControl 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FormLabel>Author Name</FormLabel>
            <FormControl 
              type="text" 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FormLabel>Reading Status</FormLabel>
            <Form.Select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Read">Read</option>
            </Form.Select>
          </Form.Group>

          {/* Conditional rendering for 'Read' status */}
          {formData.status === 'Read' && (
            <>
              <hr />
              <p className="text-muted">Enter your learnings below:</p>
              <Form.Group className="mb-3">
                <FormLabel>Book Summary</FormLabel>
                <FormControl 
                  as="textarea" 
                  rows={3} 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleChange} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <FormLabel>Learnings from the book</FormLabel>
                <FormControl 
                  as="textarea" 
                  rows={3} 
                  name="details" 
                  value={formData.details} 
                  onChange={handleChange} 
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const Bookpage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;
  const totalPages = Math.ceil(mockBooks.length / booksPerPage);

  // State for the modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = mockBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Function to handle the "Edit Details" button click
  const handleEditClick = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Your Books</h2>
      
      {/* Book Cards Grid */}
      <Row xs={1} sm={2} lg={3} className="g-4">
        {currentBooks.map((book) => (
          <Col key={book.id}>
            <Card className="h-100 shadow-sm">
              <div className="d-flex p-3">
                <div className="flex-shrink-0 me-3">
                  <Card.Img 
                    style={{ width: '100px', height: '150px', objectFit: 'cover' }} 
                    src={defaultBookCover} 
                    alt="Book Cover"
                    className="rounded shadow-sm"
                  />
                </div>
                <div className="flex-grow-1">
                  <Card.Body className="p-0">
                    <Card.Title className="fs-5">{book.title}</Card.Title>
                    <Card.Subtitle className="text-muted">{book.author}</Card.Subtitle>
                    <div className="mt-3">
                      <span className={`badge bg-${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                    </div>
                  </Card.Body>
                </div>
              </div>
              <Card.Footer className="bg-white border-0 pt-0 d-flex justify-content-end align-items-center">
                <Button variant="danger" size="sm" className="me-2">
                  Delete
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleEditClick(book)} // Attach the handler here
                >
                  Edit Details
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <Pagination.Item
                key={pageNumber + 1}
                active={pageNumber + 1 === currentPage}
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}

      {/* The new modal component */}
      <EditBookModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        book={selectedBook}
      />
    </Container>
  );
};

export default Bookpage;
