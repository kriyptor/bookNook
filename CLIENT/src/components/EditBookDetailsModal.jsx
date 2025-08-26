import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormLabel, Alert, Spinner } from 'react-bootstrap';

const EditBookDetailsModal = ({ show, onHide, book, onUpdate, updateLoading, updateError }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        purchaseUrl: book.purchaseUrl || '',
        price: book.price || '',
        description: book.description || '',
        category: book.category || '',
        imageUrl: book.imageUrl || '',
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
    onUpdate(book._id, formData);
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
            <FormControl type="text" name="title" value={formData.title} onChange={handleChange} className="rounded" />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Author Name</FormLabel>
            <FormControl type="text" name="author" value={formData.author} onChange={handleChange} className="rounded" />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Category</FormLabel>
            <Form.Select name="category" value={formData.category} onChange={handleChange} className="rounded">
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science & Technology">Science & Technology</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Image URL</FormLabel>
            <FormControl type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="rounded" />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Purchase URL</FormLabel>
            <FormControl type="text" name="purchaseUrl" value={formData.purchaseUrl} onChange={handleChange} className="rounded" />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Price</FormLabel>
            <FormControl type="number" name="price" value={formData.price} onChange={handleChange} className="rounded" />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormLabel>Description</FormLabel>
            <FormControl as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} className="rounded" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide} disabled={updateLoading} className="rounded-pill px-4">
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={updateLoading} className="rounded-pill px-4">
          {updateLoading ? <><Spinner size="sm" animation="border" className="me-2" />Saving...</> : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookDetailsModal;