import React from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';

const DeleteBookModal = ({ show, onHide, bookId, onConfirmDelete }) => {
  const handleRemoveFromList = () => {
    onConfirmDelete(bookId, 'remove');
    onHide();
  };

  const handleDeleteCompletely = () => {
    onConfirmDelete(bookId, 'delete');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to remove this book? This action cannot be undone.</p>
        <Row className="g-3 mt-3">
          <Col md={6}>
            <Card
              className="p-3 text-center border-danger"
              style={{ cursor: 'pointer' }}
              onClick={handleRemoveFromList}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>❌</div>
              <h6 className="mb-0">Remove from List</h6>
              <small className="text-muted">Keep the book data in your collection.</small>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="p-3 text-center border-danger"
              style={{ cursor: 'pointer' }}
              onClick={handleDeleteCompletely}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>🗑️</div>
              <h6 className="mb-0">Delete Book Completely</h6>
              <small className="text-muted">Delete all data from the database.</small>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBookModal;
