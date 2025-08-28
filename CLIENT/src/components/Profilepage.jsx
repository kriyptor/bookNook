import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProfileModal = ({ show, onHide, user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', profilePic: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', profilePic: user.profilePic || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) throw new Error('No authentication token found.');

      const response = await axios.post(`${BASE_URL}/auth/user`, formData, {
        headers: { 'Authorization': userToken }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onHide();
      } else {
        throw new Error(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture URL</Form.Label>
            <Form.Control
              type="text"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              placeholder="Enter profile picture URL"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userToken = localStorage.getItem('token');
        if (!userToken) throw new Error('No authentication token found.');

        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: { 'Authorization': userToken }
        });

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-5">
              <img
                src={user.profilePic || 'https://placehold.co/150x150/png?text=Profile'}
                alt="Profile Pic"
                className="rounded-circle mb-4 shadow"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Title className="h3 fw-bold mb-2">{user.name}</Card.Title>
              <Card.Text className="text-muted mb-4">{user.email}</Card.Text>
              <Button variant="primary" onClick={() => setShowModal(true)} className="rounded-pill px-4">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <EditProfileModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={user}
        onUpdate={handleUpdateUser}
      />
    </Container>
  );
};

export default ProfilePage;