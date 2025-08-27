import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Pagination, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import ReadingListCard from './ReadingListCard';
import DeleteReadingListModal from './DeleteReadingListModal';

const getReadingListStatus = (total, completed) => {
  if (completed === total && total > 0) {
    return { status: 'Completed', color: 'success' };
  } else if (completed > 0) {
    return { status: 'In Progress', color: 'primary' };
  } else {
    return { status: 'Yet to be Started', color: 'secondary' };
  }
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NotStartedreadinglist = () => {
  const navigate = useNavigate();
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [deletingListId, setDeletingListId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    async function fetchReadingLists() {
      try {
        setLoading(true);
        const userToken = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/reading-lists/not-started?page=${pagination.currentPage}`, {
          headers: {
            'Authorization': userToken
          }
        });

        if (response.data.success) {
          setReadingLists(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching reading lists:', error);
        setError('Failed to fetch reading lists. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchReadingLists();
  }, [pagination.currentPage]);

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, currentPage: pageNumber }));
  };
  
  const handleShowDeleteModal = (listId) => {
    setSelectedListId(listId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (listId, type) => {
    setDeletingListId(listId);
    setError(null);
    try {
      const userToken = localStorage.getItem('token');
      const url = type === 'listAndBooks' 
        ? `${BASE_URL}/reading-lists/${listId}/with-books`
        : `${BASE_URL}/reading-lists/${listId}`;
      
      await axios.delete(url, {
        headers: { 'Authorization': userToken }
      });

      setReadingLists(readingLists.filter(list => list._id !== listId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting reading list:', error);
      setError('Failed to delete reading list. Please try again.');
    } finally {
      setDeletingListId(null);
    }
  };
  
  const handleViewList = (listId) => {
    navigate(`/reading-list/${listId}`);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
  
  if (readingLists.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h4 className="text-muted">You don't have any reading lists yet.</h4>
        <p className="text-muted">Click "New Reading List" in the navigation bar to create one.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="my-5">
        <h2 className="mb-4 text-center">Your Reading Lists</h2>
        
        {error && <Alert variant="danger" className="rounded-pill">{error}</Alert>}
        
        <Row xs={1} sm={2} lg={3} className="g-4">
          {readingLists.map((list) => {
            const { status, color } = getReadingListStatus(list.books.length, list.completedBooks || 0);
            return (
              <Col key={list._id}>
                <ReadingListCard
                  title={list.title}
                  status={status}
                  color={color}
                  totalBooks={list.books.length}
                  completion={list.progress}
                  onView={() => handleViewList(list._id)}
                  onDelete={() => handleShowDeleteModal(list._id)}
                  isDeleting={deletingListId === list._id}
                />
              </Col>
            );
          })}
        </Row>
  
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage} />
              {[...Array(pagination.totalPages).keys()].map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber + 1}
                  active={pageNumber + 1 === pagination.currentPage}
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage} />
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

export default NotStartedreadinglist;