import { useState } from 'react';
import { Modal, Button, Form, FormControl, FormLabel, Row, Col, Card } from 'react-bootstrap';

const CreateReadingList = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [readingListFormData, setReadingListFormData] = useState({
    title: '',
    description: '',
  });
  const [books, setBooks] = useState([]);
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

  const handleAddBook = () => {
    // Basic validation to ensure book has a title and author
    if (currentBook.title && currentBook.author && currentBook.category) {
      setBooks([...books, { ...currentBook }]);
      // Reset the current book form
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
      // You can add a proper alert or a toast notification here
      alert('Title, author, and category are required for a book.');
    }
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleCreateReadingList = () => {
    // This is where you would send the data to your API
    const finalData = {
      ...readingListFormData,
      books: books,
    };
    console.log('Final Reading List Data:', finalData);
    // After successful API call, close the modal and reset state
    onHide();
    setStep(1);
    setReadingListFormData({ title: '', description: '' });
    setBooks([]);
  };

  // Step 1: Reading List Details Form
  const renderStep1 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Step 1: Reading List Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <FormLabel>Title</FormLabel>
            <FormControl
              type="text"
              name="title"
              value={readingListFormData.title}
              onChange={handleReadingListChange}
              placeholder="e.g., My Summer Reads"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormControl
              as="textarea"
              rows={3}
              name="description"
              value={readingListFormData.description}
              onChange={handleReadingListChange}
              placeholder="A list of books I plan to read this summer."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleNextStep}
          disabled={!readingListFormData.title || !readingListFormData.description}
        >
          Next
        </Button>
      </Modal.Footer>
    </>
  );

  // Step 2: Book Entry Form and List
  const renderStep2 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Step 2: Add Books</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <h4 className="mb-3">Add a New Book</h4>
        <Form className="mb-4">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FormLabel>Book Title</FormLabel>
                <FormControl
                  type="text"
                  name="title"
                  value={currentBook.title}
                  onChange={handleBookChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FormLabel>Author Name</FormLabel>
                <FormControl
                  type="text"
                  name="author"
                  value={currentBook.author}
                  onChange={handleBookChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FormLabel>Category</FormLabel>
                <Form.Select
                  name="category"
                  value={currentBook.category}
                  onChange={handleBookChange}
                >
                  <option value="">Select a Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl
                  type="text"
                  name="imageUrl"
                  value={currentBook.imageUrl}
                  onChange={handleBookChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleAddBook} className="mt-2">
              <span className="me-2">+</span> Add Book
            </Button>
          </div>
        </Form>
        <h4 className="mb-3">Books in this List: ({books.length})</h4>
        <div className="flex-grow-1 overflow-auto">
          {books.length === 0 ? (
            <p className="text-center text-muted">No books added yet.</p>
          ) : (
            books.map((book, index) => (
              <Card key={index} className="mb-3 shadow-sm">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">{book.title}</h5>
                    <p className="mb-0 text-muted">{book.author}</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveBook(index)}>
                    <span>-</span>
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handlePrevStep}>
          Back
        </Button>
        <Button variant="success" onClick={handleCreateReadingList} disabled={books.length === 0}>
          Create Reading List
        </Button>
      </Modal.Footer>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} fullscreen={true}>
      <Form>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </Form>
    </Modal>
  );
};

export default CreateReadingList;
