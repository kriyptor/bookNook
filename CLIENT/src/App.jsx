import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Auth from "./components/Auth";
import Readinglistpage from "./components/Readinglistpage";
import Profilepage from "./components/Profilepage";
import BookNookNavbar from "./components/BookNookNavbar";
import Bookpage from "./components/Bookpage";
import axios from 'axios'; 

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiEndPoint = `http://13.232.30.37`


  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  // Login handler
  const handleLogin = async (token) => {
    try {
      await fetchUserPremiumStatus(token);
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token); //change to -> localStorage.setItem('token', response.data.token)
    } catch (error) {
      console.error("Login error:", error);
      // Add proper error handling here
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <Spinner animation="border" /> // Or a proper loading component
  }

  return (
    <Router>
      {/* Navbar only shown when authenticated */}
      {isAuthenticated && 
        <BookNookNavbar 
          onLogout={handleLogout} 
          token={token} // Add userId if needed in navbar
        />
      }

      <Routes>
        {/* Default route redirects based on authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/Readinglist" /> : <Readinglistpage/>
          } 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/Readinglist" 
          element={
            isAuthenticated ? <Readinglistpage token={token}  /> : <Navigate to="/" />
          } 
        />

        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App
