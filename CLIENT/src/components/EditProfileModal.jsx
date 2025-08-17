import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

// The EditProfileModal component is now defined within the same file.
const EditProfileModal = ({ show, onHide, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    profilePic: ''
  });

  // Prepopulate the form with current user data when the modal is shown
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend API
    // For this example, we'll just update the parent state
    console.log('Updated user data:', formData);
    onUpdateUser(formData);
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;