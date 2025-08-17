import { PlusCircleFill } from 'react-bootstrap-icons'; // Import icon for buttons
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import CreateReadingList from './CreateReadingList'; // Import the modal component
import CreateBookModal from './CreateBookModal'; // Import the book creation modal

const BookNookNavbar = ({ onLogout }) => {
  const navigate = useNavigate();  
  const [token, setToken] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [showBookModal, setShowBookModal] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/'); // Redirect to login page
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky='top'>
        <Container>
          <Navbar.Brand href="/">BookNook</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigation('/dashboard')}>Dashboard</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('/books')}>Books</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('/reading-lists')}>Reading Lists</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('/profile')}>Profile</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <Button 
                variant="outline-light" 
                className="me-2"
                onClick={() => setShowModal(true)} // Open the modal on click
              >
                New Reading List
              </Button>
              <Button 
                variant="outline-light" 
                className="me-4"
                onClick={() => setShowBookModal(true)}
              >
                New Book
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* The Modal Component */}
      <CreateReadingList 
        show={showModal} 
        onHide={() => setShowModal(false)} 
      />
      <CreateBookModal
        show={showBookModal}
        onHide={() => setShowBookModal(false)}
      />
    </>
  );
};

export default BookNookNavbar;