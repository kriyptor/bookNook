import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormLabel } from 'react-bootstrap';

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

export default EditBookModal;
