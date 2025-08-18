import BookCard from './BookCard';
import EditBookModal from './EditBookModal';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';

// Mock data for 20 books (added mock summary/details for testing the modal)
const mockBooks = [
  { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', status: 'Reading', summary: '', details: '' },
  { id: 2, title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', status: 'Reading', summary: '', details: '' },
  { id: 3, title: 'Dune', author: 'Frank Herbert', status: 'Reading', summary: 'A complex sci-fi epic about politics and religion on a desert planet.', details: 'Learned about the long-term impacts of political decisions on ecology and culture.' },
  { id: 4, title: '1984', author: 'George Orwell', status: 'Reading', summary: '', details: '' },
  { id: 5, title: 'Brave New World', author: 'Aldous Huxley', status: 'Reading', summary: '', details: '' },
  { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'Reading', summary: 'A tale of a hobbit who joins a quest to reclaim a dragon\'s treasure.', details: 'The importance of courage in the face of overwhelming odds.' },
  { id: 7, title: 'Fahrenheit 451', author: 'Ray Bradbury', status: 'Reading', summary: '', details: '' },
  { id: 8, title: 'The Catcher in the Rye', author: 'J.D. Salinger', status: 'Reading', summary: '', details: '' },
  { id: 9, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'Reading', summary: 'A story about racial injustice and the loss of innocence in the American South.', details: 'Gained a deeper understanding of empathy and moral courage.' },
  { id: 10, title: 'Pride and Prejudice', author: 'Jane Austen', status: 'Reading', summary: '', details: '' },
];


const ReadingBooks = () => {
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
            <BookCard
              title={book.title}
              author={book.author}
              status={book.status}
              imageUrl={book.imageUrl}
              onEdit={() => handleEditClick(book)}
              onDelete={() => console.log(book.id)}
            />
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

export default ReadingBooks;
