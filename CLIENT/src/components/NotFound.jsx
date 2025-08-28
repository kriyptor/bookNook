import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="my-5 text-center">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h1 className="display-4 text-danger">404</h1>
              <Card.Title className="mb-4">Page Not Found</Card.Title>
              <Card.Text className="mb-4">
                Oops! It seems the page you're looking for doesn't exist or has been moved.
              </Card.Text>
              <Button variant="primary" href="/" className="rounded-pill px-4">
                Go Back Home
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;