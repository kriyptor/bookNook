import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import { PlusCircleFill, Trash, JournalCheck, Search, XCircle } from 'react-bootstrap-icons'; 
import axios from 'axios';


const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_BOOKS_API_URL = import.meta.env.VITE_GOOGLE_API_URL; 
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom hook to handle API fetching logic using Axios
const useGoogleBooks = (query, triggerSearch) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("token");
  
  useEffect(() => {
    const source = axios.CancelToken.source();

    if (triggerSearch && query.length > 2) {
      const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${GOOGLE_BOOKS_API_URL}?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`,
            { cancelToken: source.token }
          );
          const data = response.data;
          setBooks(data.items || []);
        } catch (err) {
          if (axios.isCancel(err)) {
            console.log('Request canceled:', err.message);
          } else {
            setError('Failed to fetch books. Please check your API key.');
            setBooks([]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBooks();
    } else {
      setBooks([]);
    }

    return () => {
      source.cancel('Component unmounted or query changed');
    };
  }, [query, triggerSearch]);

  return { books, loading, error };
};

const AddBookToListModal = ({ show, onHide, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const { books: searchResults, loading, error } = useGoogleBooks(searchQuery, triggerSearch);
  const [booksToAdd, setBooksToAdd] = useState([]);
  const [manualEntryFormData, setManualEntryFormData] = useState({
    title: '',
    author: '',
    purchaseUrl: '',
    price: '',
    description: '',
    category: '',
    imageUrl: ''
  });

  const handleManualFormChange = (e) => {
    const { name, value } = e.target;
    setManualEntryFormData({ ...manualEntryFormData, [name]: value });
  };

  const handlePopulateManualForm = (book) => {
    setManualEntryFormData({
      title: book.volumeInfo.title || '',
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
      description: book.volumeInfo.description || '',
      category: book.volumeInfo.categories ? book.volumeInfo.categories[0] : '',
      imageUrl: book.volumeInfo.imageLinks?.thumbnail || '',
      purchaseUrl: book.saleInfo?.buyLink || '',
      price: book.saleInfo?.listPrice?.amount || '',
    });
    setSearchQuery('');
    setTriggerSearch(false);
  };

  const handleManualAdd = () => {
    if (manualEntryFormData.title && manualEntryFormData.author && manualEntryFormData.category) {
      setBooksToAdd([...booksToAdd, { ...manualEntryFormData, id: Date.now() }]);
      setManualEntryFormData({
        title: '',
        author: '',
        purchaseUrl: '',
        price: '',
        description: '',
        category: '',
        imageUrl: ''
      });
    } else {
      alert('Title, author, and category are required for a book.');
    }
  };

  const handleClearEntry = () => {
    setManualEntryFormData({
      title: '',
      author: '',
      purchaseUrl: '',
      price: '',
      description: '',
      category: '',
      imageUrl: ''
    });
  };

  const handleRemoveBook = (index) => {
    setBooksToAdd(booksToAdd.filter((_, i) => i !== index));
  };

  const handleAddToList = () => {
    onAdd(booksToAdd);
    setBooksToAdd([]);
    setSearchQuery('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen={true}>
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title>Add New Books to Reading List</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-white">
        <Row className="g-4">
          {/* Search Column */}
          <Col md={6} className="border border-light-subtle rounded p-3">
             <h4 className="mb-3 text-center">
              <span className='badge bg-primary'>
                Search for Books
              </span>
            </h4>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-pill"
              />
              <Button 
                variant="primary" 
                className="rounded-pill ms-2"
                onClick={() => setTriggerSearch(true)}
              >
                <Search className="me-2" />
                Search
              </Button>
            </InputGroup>
            {loading && <div className="text-center"><Spinner animation="border" size="sm" /> Searching...</div>}
            {error && <div className="text-danger text-center">{error}</div>}
            {searchResults.length > 0 && (
              <ListGroup className="shadow-sm border-0 rounded overflow-auto w-100" style={{ maxHeight: '250px' }}>
                {searchResults.map(book => (
                  <ListGroup.Item key={book.id} className="d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                      <img 
                        src={book.volumeInfo.imageLinks?.smallThumbnail || 'https://placehold.co/60x90/png?text=No+Cover'} 
                        alt="Book Cover" 
                        className="rounded me-2"
                      />
                      <div>
                        <strong className="d-block">{book.volumeInfo.title}</strong>
                        <span className="text-muted small">by {book.volumeInfo.authors?.join(', ') || 'Unknown'}</span>
                      </div>
                    </div>
                    <Button variant="outline-success" size="sm" onClick={() => handlePopulateManualForm(book)}>Add</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          {/* Manual Entry Column */}
          <Col md={6} className="border border-light-subtle rounded p-3">
             <h4 className="mb-3 text-center">
              <span className='badge bg-primary'>
                Book Data
              </span>
            </h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={manualEntryFormData.title} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control name="author" value={manualEntryFormData.author} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={manualEntryFormData.category} onChange={handleManualFormChange} className="rounded">
                  <option value="">Select Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL (Optional)</Form.Label>
                <Form.Control name="imageUrl" value={manualEntryFormData.imageUrl} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Purchase URL (Optional)</Form.Label>
                <Form.Control name="purchaseUrl" value={manualEntryFormData.purchaseUrl} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price (Optional)</Form.Label>
                <Form.Control name="price" value={manualEntryFormData.price} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={manualEntryFormData.description} onChange={handleManualFormChange} className="rounded" />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="primary" onClick={handleManualAdd} className="rounded-pill">
                  <PlusCircleFill className="me-2" />
                  Add Book
                </Button>
                <Button variant="danger" onClick={handleClearEntry} className="rounded-pill">
                  <Trash className="me-2" />
                  Clear Details
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr className="my-4" />

        {/* Books to Add List */}
         <h4 className="mb-3 text-center">
              <span className='badge bg-primary'>
               Books to Add ({booksToAdd.length})
              </span>
            </h4>
        <div className="overflow-auto" style={{ maxHeight: '300px' }}>
          <Row className="g-3">
            {booksToAdd.length === 0 ? (
              <Col><p className="text-center text-muted fst-italic">No books added yet.</p></Col>
            ) : (
              booksToAdd.map((book, index) => (
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
        <Button variant="secondary" onClick={onHide} className="rounded-pill">
          <XCircle className="me-2"/>
          Cancel
        </Button>
        <Button variant="success" onClick={handleAddToList} disabled={booksToAdd.length === 0} className="rounded-pill">
          <JournalCheck className="me-2"/>
            Add to List
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBookToListModal;