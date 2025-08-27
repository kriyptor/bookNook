import React from 'react';
import { Modal, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';

const DeleteBookModal = ({ show, onHide, bookId, onConfirmDelete, loading, error }) => {
  const handleRemoveFromList = () => {
    if (!loading) {
      onConfirmDelete(bookId, 'remove');
    }
  };

  const handleDeleteCompletely = () => {
    if (!loading) {
      onConfirmDelete(bookId, 'delete');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        <p>Are you sure you want to remove this book? This action cannot be undone.</p>
        <Row className="g-3 mt-3">
          <Col md={6}>
            <Card
              className={`p-3 text-center border-danger ${loading ? 'opacity-50' : ''}`}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={handleRemoveFromList}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>⌘</div>
              <h6 className="mb-0">Remove from List</h6>
              <small className="text-muted">Keep the book data in your collection.</small>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className={`p-3 text-center border-danger ${loading ? 'opacity-50' : ''}`}
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              onClick={handleDeleteCompletely}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>🗑️</div>
              <h6 className="mb-0">Delete Book Completely</h6>
              <small className="text-muted">Delete all data from the database.</small>
            </Card>
          </Col>
        </Row>
        {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" size="sm" className="me-2" />
            <span>Processing deletion...</span>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBookModal;