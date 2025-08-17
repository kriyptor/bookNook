import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';

// Mock data to simulate API response for dashboard stats
const mockDashboardData = {
  bookStats: {
    totalBooks: 50,
    booksRead: 30,
    booksYetToRead: 15,
    booksOngoing: 5,
    totalCost: 750.50,
    mostReadAuthor: 'J.K. Rowling',
    mostReadCategory: 'Fantasy'
  },
  readingListStats: {
    totalReadingLists: 8,
    completedReadingLists: 2,
    yetToCompleteLists: 6,
    ongoingReadingLists: 3
  }
};

const Dashboard = () => {
  const [data, setData] = useState(mockDashboardData);

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
      <h2 className="mb-4 text-center">Your Dashboard</h2>
      
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
                  <span className="fw-bold text-success">${data.bookStats.totalCost.toFixed(2)}</span>
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
