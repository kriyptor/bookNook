import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, InputGroup, ListGroup } from 'react-bootstrap';

// Mock data to simulate the Google Books API response
const mockApiData = [
  {
    id: 1,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    imageUrl: 'https://placehold.co/100x150/png?text=LotR'
  },
  {
    id: 2,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    imageUrl: 'https://placehold.co/100x150/png?text=Hobbit'
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Fiction',
    imageUrl: 'https://placehold.co/100x150/png?text=Dune'
  },
  {
    id: 4,
    title: 'Dune Messiah',
    author: 'Frank Herbert',
    category: 'Fiction',
    imageUrl: 'https://placehold.co/100x150/png?text=Dune+Messiah'
  },
  {
    id: 5,
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    imageUrl: 'https://placehold.co/100x150/png?text=1984'
  },
];

// Helper to simulate API call to Google Books
const fetchBooks = (query) => {
  if (!query) return [];
  const lowerCaseQuery = query.toLowerCase();
  return mockApiData.filter(book => 
    book.title.toLowerCase().includes(lowerCaseQuery) || 
    book.author.toLowerCase().includes(lowerCaseQuery)
  );
};

const CreateReadingList = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [readingListFormData, setReadingListFormData] = useState({
    title: '',
    description: '',
  });
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentBook, setCurrentBook] = useState({
    title: '',
    author: '',
    purchaseUrl: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleReadingListChange = (e) => {
    const { name, value } = e.target;
    setReadingListFormData({
      ...readingListFormData,
      [name]: value,
    });
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook({
      ...currentBook,
      [name]: value,
    });
  };

  const handlePopulateManualForm = (book) => {
    setCurrentBook({
      ...currentBook,
      title: book.title,
      author: book.author,
      category: book.category,
      imageUrl: book.imageUrl,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddBook = () => {
    if (currentBook.title && currentBook.author && currentBook.category) {
      setBooks([...books, { ...currentBook, id: Date.now() }]);
      setCurrentBook({
        title: '',
        author: '',
        purchaseUrl: '',
        price: '',
        description: '',
        category: '',
        imageUrl: '',
      });
    } else {
      alert('Title, author, and category are required for a book.');
    }
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleCreateReadingList = () => {
    const finalData = {
      ...readingListFormData,
      books: books,
    };
    console.log('Final Reading List Data:', finalData);
    onHide();
    setStep(1);
    setReadingListFormData({ title: '', description: '' });
    setBooks([]);
    setSearchResults([]);
    setSearchQuery('');
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = fetchBooks(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Step 1: Reading List Details Form
  const renderStep1 = () => (
    <>
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title>Step 1: Reading List Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-white">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={readingListFormData.title}
              onChange={handleReadingListChange}
              placeholder="e.g., My Summer Reads"
              className="rounded"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={readingListFormData.description}
              onChange={handleReadingListChange}
              placeholder="A list of books I plan to read this summer."
              className="rounded"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light border-top">
        <Button variant="secondary" onClick={onHide} className="rounded-pill">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleNextStep}
          disabled={!readingListFormData.title || !readingListFormData.description}
          className="rounded-pill"
        >
          Next
        </Button>
      </Modal.Footer>
    </>
  );

  // Step 2: Book Entry Form and List
  const renderStep2 = () => (
    <>
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title>Step 2: Add Books</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-white">
        <Row className="g-4">
          {/* Search Column */}
          <Col md={6} className="border border-light-subtle rounded p-3">
            <h5 className="mb-3 fw-bold">Search for Books</h5>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-pill"
              />
              <Button variant="primary" className="rounded-pill ms-2">Search</Button>
            </InputGroup>
            {searchResults.length > 0 && (
              <ListGroup className="shadow-sm border-0 rounded overflow-auto" style={{ maxHeight: '250px' }}>
                {searchResults.map(book => (
                  <ListGroup.Item key={book.id} className="d-flex justify-content-between align-items-center border-0">
                    <div>
                      <strong>{book.title}</strong> by {book.author} ({book.category})
                    </div>
                    <Button variant="outline-success" size="sm" onClick={() => handlePopulateManualForm(book)}>Add</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          {/* Manual Entry Column */}
          <Col md={6} className="border border-light-subtle rounded p-3">
            <h5 className="mb-3 fw-bold">Manual Entry</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Book Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={currentBook.title}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author Name</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={currentBook.author}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={currentBook.category}
                  onChange={handleBookChange}
                  className="rounded"
                >
                  <option value="">Select a Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={currentBook.imageUrl}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Purchase URL (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="purchaseUrl"
                  value={currentBook.purchaseUrl}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={currentBook.price}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={currentBook.description}
                  onChange={handleBookChange}
                  className="rounded"
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddBook} className="rounded-pill">
                  + Add Book
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr className="my-4" />

        {/* Books in this List */}
        <h5 className="mb-3 fw-bold">Books in this List ({books.length})</h5>
        <div className="overflow-auto" style={{ maxHeight: '300px' }}>
          <Row className="g-3">
            {books.length === 0 ? (
              <Col><p className="text-center text-muted fst-italic">No books added yet.</p></Col>
            ) : (
              books.map((book, index) => (
                <Col key={index} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow border-0 rounded">
                    <Card.Body className="d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src={book.imageUrl || 'https://placehold.co/60x90/png?text=No+Cover'} 
                          alt="Book Cover" 
                          style={{ width: '60px', height: '90px', objectFit: 'cover' }} 
                          className="rounded me-3 shadow-sm"
                        />
                        <div>
                          <h6 className="mb-1">{book.title}</h6>
                          <p className="mb-0 text-muted small">{book.author} • {book.category}</p>
                        </div>
                      </div>
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveBook(index)} className="rounded-circle">
                        -
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light border-top">
        <Button variant="secondary" onClick={handlePrevStep} className="rounded-pill">
          Back
        </Button>
        <Button variant="success" onClick={handleCreateReadingList} disabled={books.length === 0} className="rounded-pill">
          Create Reading List
        </Button>
      </Modal.Footer>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} fullscreen={true}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </Modal>
  );
};

export default CreateReadingList;