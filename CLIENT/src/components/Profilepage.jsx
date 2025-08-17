import React, { useState, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

const ProfilePage = () => {
  // Mock user data
  const [user, setUser] = useState({
    name: 'Kriyptor',
    username: 'kriyptor',
    email: 'kriyptor@example.com',
    profilePic: 'https://placehold.co/150x150/png?text=KP' // Placeholder image
  });

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // This function would be passed to the modal to update user state
  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Title className="h4">{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">@{user.username}</Card.Subtitle>
              <hr />
              <div className="text-start">
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <Button variant="primary" onClick={handleShowModal} className="mt-3">
                Edit Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <EditProfileModal
        show={showModal}
        onHide={handleCloseModal}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
    </Container>
  );
};

export default ProfilePage;