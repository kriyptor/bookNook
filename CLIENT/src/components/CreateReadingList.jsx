import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_BOOKS_API_URL = import.meta.env.VITE_GOOGLE_API_URL; 
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom hook to handle API fetching logic using Axios
const useGoogleBooks = (query, triggerSearch) => {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [userToken, setUserToken] = useState("");

  React.useEffect(() => {
    setUserToken(localStorage.getItem("token"));
  }, []);


  React.useEffect(() => {
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

const CreateReadingList = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [readingListFormData, setReadingListFormData] = useState({
    title: '',
    description: '',
  });
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const { books: searchResults, loading, error } = useGoogleBooks(searchQuery, triggerSearch);
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

  const handleCreateReadingList = async () => {
    try{
      const finalData = {
      ...readingListFormData,
      books: books,
    };
    console.log('Final Reading List Data:', finalData);
    
      const userToken = localStorage.getItem("token")

     await axios.post(`${BASE_URL}/reading-lists`, finalData,
         { headers: {"Authorization" : userToken } }
      );

    onHide();
    setStep(1);
    setReadingListFormData({ title: '', description: '' });
    setBooks([]);
    setSearchQuery('');

    }catch(err){
      console.log(err)
    }
  };

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
              <Button 
                variant="primary" 
                className="rounded-pill ms-2"
                onClick={() => setTriggerSearch(true)}
              >
                Search
              </Button>
            </InputGroup>
            {loading && <div className="text-center"><Spinner animation="border" size="sm" /> Searching...</div>}
            {error && <div className="text-danger text-center">{error}</div>}
            {searchResults.length > 0 && (
              <ListGroup className="shadow-sm border-0 rounded overflow-auto w-100" style={{ maxHeight: '350px' }}>
                {searchResults.map(book => (
                  <ListGroup.Item key={book.id} className="d-flex justify-content-between align-items-center border-1">
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
    <option value="Spirituality">Spirituality</option>
    <option value="Philosophy">Philosophy</option>
    <option value="Biography & Memoir">Biography & Memoir</option>
    <option value="Literature & Poetry">Literature & Poetry</option>
    <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
    <option value="Mystery & Thriller">Mystery & Thriller</option>
    <option value="Self-Help & Personal Development">Self-Help & Personal Development</option>
    <option value="Business & Finance">Business & Finance</option>
    <option value="History">History</option>
    <option value="Arts & Photography">Arts & Photography</option>
    <option value="Health & Wellness">Health & Wellness</option>
    <option value="Science & Technology">Science & Technology</option>
    <option value="Graphic Novels & Comics">Graphic Novels & Comics</option>
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
                  <Card className="h-100 border-1 rounded bg-light">
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