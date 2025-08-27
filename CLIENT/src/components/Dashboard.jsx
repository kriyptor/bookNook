import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userToken = localStorage.getItem('token');
      
      const response = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          'Authorization': userToken
        }
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center">
          <Button variant="primary" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="my-5">
        <Alert variant="info">No dashboard data available.</Alert>
        <div className="text-center">
          <Button variant="primary" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </Container>
    );
  }

  // Calculate book completion percentage
  const bookCompletionPercentage = data.bookStats.totalBooks > 0
    ? Math.round((data.bookStats.booksRead / data.bookStats.totalBooks) * 100)
    : 0;

  // Calculate reading list completion percentage
  const readingListCompletionPercentage = data.readingListStats.totalReadingLists > 0
    ? Math.round((data.readingListStats.completedReadingLists / data.readingListStats.totalReadingLists) * 100)
    : 0;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-center flex-grow-1">Your Dashboard</h2>
        <Button variant="primary" onClick={fetchDashboardData}>
          Refresh
        </Button>
      </div>
      
      {/* Book Stats Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="text-primary">Book Statistics</Card.Title>
          <hr />
          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1">{data.bookStats.totalBooks}</Card.Title>
                  <Card.Text>Total Books in Collection</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-success">{data.bookStats.booksRead}</Card.Title>
                  <Card.Text>Books Read</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-secondary">{data.bookStats.booksYetToRead}</Card.Title>
                  <Card.Text>Yet to Read</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-warning">{data.bookStats.booksOngoing}</Card.Title>
                  <Card.Text>Ongoing Reading</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card className="h-100 p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Overall Book Completion</h6>
                  <span className="fw-bold">{bookCompletionPercentage}%</span>
                </div>
                <ProgressBar now={bookCompletionPercentage} variant="info" className="mt-2" />
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 p-3">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">Total Book Cost</h6>
                  <span className="fw-bold text-success">₹{data.bookStats.totalCost.toFixed(2)}</span>
                </div>
              </Card>
            </Col>
          </Row>
           <Row className="mt-4">
            <Col md={6}>
              <Card className="h-100 p-3">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">Most Read Author</h6>
                  <span className="fw-bold">{data.bookStats.mostReadAuthor}</span>
                </div>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 p-3">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">Most Read Category</h6>
                  <span className="fw-bold">{data.bookStats.mostReadCategory}</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Reading List Stats Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="text-primary">Reading List Statistics</Card.Title>
          <hr />
          <Row className="g-4">
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1">{data.readingListStats.totalReadingLists}</Card.Title>
                  <Card.Text>Total Reading Lists</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-success">{data.readingListStats.completedReadingLists}</Card.Title>
                  <Card.Text>Completed Lists</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-secondary">{data.readingListStats.yetToCompleteLists}</Card.Title>
                  <Card.Text>Yet to Complete</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <Card.Title className="fs-1 text-warning">{data.readingListStats.ongoingReadingLists}</Card.Title>
                  <Card.Text>Ongoing Lists</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
             <Col>
              <Card className="h-100 p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Overall Reading List Completion</h6>
                  <span className="fw-bold">{readingListCompletionPercentage}%</span>
                </div>
                <ProgressBar now={readingListCompletionPercentage} variant="info" className="mt-2" />
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;