import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import DeleteReadingListModal from './DeleteReadingListModal';

const mockReadingLists = [
  { id: 1, title: 'My Favorites', totalBooks: 5, completedBooks: 5 },
  { id: 2, title: 'Summer Reads', totalBooks: 10, completedBooks: 3 },
  { id: 3, title: 'Fantasy Worlds', totalBooks: 8, completedBooks: 0 },
  { id: 4, title: 'Tech and Code', totalBooks: 7, completedBooks: 7 },
  { id: 5, title: 'History & Biographies', totalBooks: 6, completedBooks: 2 },
  { id: 6, title: 'Self-Help Classics', totalBooks: 4, completedBooks: 0 },
  { id: 7, title: 'Mystery Thrillers', totalBooks: 9, completedBooks: 9 },
  { id: 8, title: 'Sci-Fi Essentials', totalBooks: 12, completedBooks: 6 },
  { id: 9, title: 'Learning Italian', totalBooks: 2, completedBooks: 1 },
  { id: 10, title: 'The Great Outdoors', totalBooks: 3, completedBooks: 0 },
  { id: 11, title: 'Cooking for Beginners', totalBooks: 5, completedBooks: 5 },
  { id: 12, title: 'Art History', totalBooks: 4, completedBooks: 1 },
];

const getReadingListStatus = (total, completed) => {
  if (completed === total && total > 0) {
    return { status: 'Completed', color: 'success' };
  } else if (completed > 0) {
    return { status: 'In Progress', color: 'primary' };
  } else {
    return { status: 'Yet to be Started', color: 'secondary' };
  }
};

const Readinglistpage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockReadingLists.length / itemsPerPage);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockReadingLists.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleShowDeleteModal = (listId) => {
    setSelectedListId(listId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (listId, type) => {
    console.log(`Deleting list ID ${listId} with type: ${type}`);
    // This is where you would call your API endpoint
    // For example:
    // if (type === 'listAndBooks') {
    //   axios.delete(`/api/reading-lists/${listId}/with-books`);
    // } else {
    //   axios.delete(`/api/reading-lists/${listId}`);
    // }
  };
  
  const handleViewList = (listId) => {
    navigate(`/reading-list/${listId}`);
  };

  return (
    <>
      <Container className="my-5">
        <h2 className="mb-4 text-center">Your Reading Lists</h2>
        
        <Row xs={1} sm={2} lg={3} className="g-4">
          {currentItems.map((list) => {
            const { status, color } = getReadingListStatus(list.totalBooks, list.completedBooks);
            return (
              <Col key={list.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="fs-5">{list.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {list.totalBooks} book(s)
                    </Card.Subtitle>
                    <div className="mt-3">
                      <span className={`badge bg-${color}`}>
                        {status}
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 pt-0 d-flex justify-content-end align-items-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowDeleteModal(list.id)}
                    >
                      Delete
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleViewList(list.id)}
                    >
                      View List
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
  
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber + 1}
                  active={pageNumber + 1 === currentPage}
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </Container>
      
      <DeleteReadingListModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        listId={selectedListId}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default Readinglistpage;

