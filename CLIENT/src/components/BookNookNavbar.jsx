import { PlusCircleFill, BoxArrowRight } from 'react-bootstrap-icons'; // Import icons
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import CreateReadingList from './CreateReadingList'; // Import the modal component
import CreateBookModal from './CreateBookModal'; // Import the book creation modal

const BookNookNavbar = ({ isAuthenticated, onLogout }) => {
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
      <Navbar bg="primary" expand="lg" sticky='top'>
        <Container>
          <Navbar.Brand href="/">BookNook</Navbar.Brand>
          {isAuthenticated && <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigation('/profile')}>Profile</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('/dashboard')}>Dashboard</Nav.Link>
              {/* Redinglist Dropdown */}
               <NavDropdown title="Reading List" id="readinglist-nav-dropdown">
                <NavDropdown.Item onClick={() => handleNavigation('/InprogressReadinglist')}>
                  All In Progress Reading Lists
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/CompletedReadinglist')}>
                  All Completed Reading Lists
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/NotStartedreadinglist')}>
                  All Not completed Reading Lists
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleNavigation('/AllReadinglist')}>
                  All Reading List
                </NavDropdown.Item>
              </NavDropdown>
              {/* Books Dropdown */}
               <NavDropdown title="Books" id="books-nav-dropdown">
                <NavDropdown.Item onClick={() => handleNavigation('/books')}>
                  All Books
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/AllReadBooks')}>
                  All Read Books
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavigation('/AllReadingBooks')}>
                  All Reading Books
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleNavigation('/FavoriteBooks')}>
                  Favourite Books
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <Button 
                variant="success" 
                className="d-flex align-items-center me-2"
                onClick={() => setShowModal(true)}
              >
                <span className="me-2">Create Reading List</span>
                <PlusCircleFill size={20} />
              </Button>
              <Button 
                variant="warning" 
                className="d-flex align-items-center me-4"
                onClick={() => setShowBookModal(true)}
              >
                <span className="me-2">Add Book</span>
                <PlusCircleFill size={20} />
              </Button>
              <Button 
                variant="danger" 
                className="d-flex align-items-center"
                onClick={handleLogout}
              >
                <span className="me-2">Logout</span>
                <BoxArrowRight size={20} />
              </Button>
            </Nav>
          </Navbar.Collapse>  
          </>}
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