import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormLabel, Alert, Spinner } from 'react-bootstrap';

const EditBookModal = ({ show, onHide, book, onUpdate, updateLoading, updateError }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: '',
    summary: '',
    details: '',
    rating: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        status: book.status || 'To Read',
        summary: book.learnings?.summary || '',
        details: book.learnings?.details || '',
        rating: book.review || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!book?._id) {
      return;
    }
    
    const payload = {
        status: formData.status,
        ...((formData.status === 'Read') && {
            summary: formData.summary,
            details: formData.details,
            rating: formData.rating
        })
    };
    
    onUpdate(book._id, payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Edit Book Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {updateError && <Alert variant="danger" className="rounded-pill">{updateError}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <FormLabel>Book Title</FormLabel>
            <FormControl 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              disabled
              className="rounded"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FormLabel>Author Name</FormLabel>
            <FormControl 
              type="text" 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              disabled
              className="rounded"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FormLabel>Reading Status</FormLabel>
            <Form.Select 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              className="rounded"
              disabled={book?.status === 'Read'}
            >
              {book?.status === 'Reading' ? (
                <>
                  <option value="Reading">Reading</option>
                  <option value="Read">Read</option>
                </>
              ) : (
                <>
                  <option value="To Read">To Read</option>
                  <option value="Reading">Reading</option>
                </>
              )}
            </Form.Select>
          </Form.Group>

          {formData.status === 'Read' && (
            <>
              <hr />
              <p className="text-muted mb-3">
                {book?.status === 'Read' ? 'Update your learnings and rating:' : 'Add your learnings and rating:'}
              </p>
              <Form.Group className="mb-3">
                <FormLabel>Book Summary</FormLabel>
                <FormControl 
                  as="textarea" 
                  rows={3} 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleChange} 
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <FormLabel>Learnings from the Book</FormLabel>
                <FormControl 
                  as="textarea" 
                  rows={3} 
                  name="details" 
                  value={formData.details} 
                  onChange={handleChange} 
                  className="rounded"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <FormLabel>Rating</FormLabel>
                <Form.Select 
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleChange}
                  className="rounded"
                >
                  <option value="">Select a rating</option>
                  <option value="Transformative">Transformative</option>
                  <option value="Worthwhile">Worthwhile</option>
                  <option value="Uninspiring">Uninspiring</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button 
          variant="secondary" 
          onClick={onHide} 
          disabled={updateLoading}
          className="rounded-pill px-4"
        >
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={updateLoading}
          className="rounded-pill px-4"
        >
          {updateLoading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookModal;
