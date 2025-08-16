import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import axios from 'axios';

const BookNookNavbar = ({ onLogout }) => {

  const navigate = useNavigate();  
  const apiEndPoint = ''

  const [token, setToken] = useState(null);
  

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/'); // Redirect to login page
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand href="/">Expense Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Button variant="light" className="me-2" onClick={() => navigate('/report')}>
              Report
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BookNookNavbar;