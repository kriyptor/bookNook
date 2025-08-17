import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormLabel, Row, Col, Card, InputGroup } from 'react-bootstrap';
// Icons from react-bootstrap-icons are not installed, so using plain text for now
// import { Search, PlusCircleFill, TrashFill } from 'react-bootstrap-icons';

// Mock data to simulate the Google Books API response
const mockApiData = [
  {
    id: 1,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    imageUrl: 'https://placehold.co/100x150/png?text=LotR'
  },
  {
    id: 2,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    imageUrl: 'https://placehold.co/100x150/png?text=Hobbit'
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Sci-Fi & Fantasy',
    imageUrl: 'https://placehold.co/100x150/png?text=Dune'
  },
  {
    id: 4,
    title: 'Dune Messiah',
    author: 'Frank Herbert',
    category: 'Sci-Fi & Fantasy',
    imageUrl: 'https://placehold.co/100x150/png?text=Dune+Messiah'
  },
  {
    id: 5,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
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

const CreateBookModal = ({ show, onHide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [booksToCreate, setBooksToCreate] = useState([]);
  const [manualEntryFormData, setManualEntryFormData] = useState({
    title: '',
    author: '',
    category: '',
    imageUrl: ''
  });

  // Effect to perform search when the query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = fetchBooks(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleManualFormChange = (e) => {
    const { name, value } = e.target;
    setManualEntryFormData({ ...manualEntryFormData, [name]: value });
  };

  const handleAddFromSearch = (book) => {
    // Add the book if it's not already in the list
    if (!booksToCreate.some(b => b.id === book.id)) {
      setBooksToCreate([...booksToCreate, book]);
    }
  };

  const handleManualAdd = () => {
    if (manualEntryFormData.title && manualEntryFormData.author && manualEntryFormData.category) {
      setBooksToCreate([...booksToCreate, { ...manualEntryFormData, id: Date.now() }]);
      setManualEntryFormData({ title: '', author: '', category: '', imageUrl: '' });
    } else {
      alert('Title, author, and category are required for manual entry.');
    }
  };

  const handleRemoveBook = (index) => {
    setBooksToCreate(booksToCreate.filter((_, i) => i !== index));
  };

  const handleCreateBooks = () => {
    console.log('Books to be created:', booksToCreate);
    // TODO: Implement API call here to send the booksToCreate array
    onHide();
    // Reset state after successful creation
    setBooksToCreate([]);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Book Entries</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        {/* Search Bar and Results */}
        <Row className="mb-4">
          <Col md={12}>
            <h4>Search for Books</h4>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-primary">Search</Button>
            </InputGroup>
            {searchResults.length > 0 && (
              <div className="search-results-dropdown p-2 rounded shadow-sm">
                {searchResults.map(book => (
                  <div key={book.id} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{book.title} by {book.author}</span>
                    <Button variant="success" size="sm" onClick={() => handleAddFromSearch(book)}>Add</Button>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
        
        <hr />

        {/* Manual Entry Form */}
        <Row className="mb-4">
          <Col md={12}>
            <h4>Or Enter Manually</h4>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Title</FormLabel>
                    <FormControl name="title" value={manualEntryFormData.title} onChange={handleManualFormChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Author</FormLabel>
                    <FormControl name="author" value={manualEntryFormData.author} onChange={handleManualFormChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Category</FormLabel>
                    <Form.Select name="category" value={manualEntryFormData.category} onChange={handleManualFormChange}>
                      <option value="">Select Category</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl name="imageUrl" value={manualEntryFormData.imageUrl} onChange={handleManualFormChange} />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleManualAdd}>
                  <span className="me-2">+</span> Add Manually
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr />

        {/* Books to Create List */}
        <h4 className="mb-3">Books to Create ({booksToCreate.length})</h4>
        <div className="flex-grow-1 overflow-auto">
          <Row>
            {booksToCreate.length === 0 ? (
              <Col><p className="text-center text-muted">No books added yet.</p></Col>
            ) : (
              booksToCreate.map((book, index) => (
                <Col key={index} md={6} className="mb-3">
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img 
                          src={book.imageUrl || 'https://placehold.co/60x90/png?text=No+Cover'} 
                          alt="Book Cover" 
                          style={{ width: '60px', height: '90px', objectFit: 'cover' }} 
                          className="rounded me-3"
                        />
                        <div>
                          <h6 className="mb-1">{book.title}</h6>
                          <p className="mb-0 text-muted">{book.author}</p>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => handleRemoveBook(index)}>
                        <span>-</span>
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleCreateBooks} disabled={booksToCreate.length === 0}>
          Create Books
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBookModal;
