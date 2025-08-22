import React from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';

const DeleteReadingListModal = ({ show, onHide, listId, onConfirmDelete }) => {

  const handleDeleteOnlyList = () => {
    onConfirmDelete(listId, 'listOnly');
    onHide();
  };

  const handleDeleteListAndBooks = () => {
    onConfirmDelete(listId, 'listAndBooks');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this reading list? This action cannot be undone.</p>
        <Row className="g-3 mt-3">
          <Col md={6}>
            <Card
              className="p-3 text-center border-danger cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={handleDeleteOnlyList}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>🗑️</div>
              <h6 className="mb-0">Delete Only List</h6>
              <small className="text-muted">Keep all books</small>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="p-3 text-center border-danger cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={handleDeleteListAndBooks}
            >
              <div className="text-danger mx-auto mb-2" style={{ fontSize: '30px' }}>📚</div>
              <h6 className="mb-0">Delete List & Books</h6>
              <small className="text-muted">Delete all books in this list</small>
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

export default DeleteReadingListModal;
