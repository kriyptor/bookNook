import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Auth from "./components/Auth";
import Readinglistpage from "./components/readinglist/Readinglistpage";
import CompletedReadinglist from "./components/readinglist/CompletedReadinglist";
import InprogressReadinglist from "./components/readinglist/InprogressReadinglist";
import NotStartedreadinglist from "./components/readinglist/NotStartedreadinglist";
import Profilepage from "./components/Profilepage";
import Dashboard from "./components/Dashboard";
import BookNookNavbar from "./components/BookNookNavbar";
import Bookpage from "./components/Bookpage";
import ReadBookpage from "./components/ReadBookpage";
import ReadingBookpage from "./components/ReadingBookpage"
import SingleReadingListPage from "./components/readinglist/SingleReadingListPage";
import axios from 'axios'; 

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiEndPoint = import.meta.env.API_BASE_URL;


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
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token); 
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
    return <Spinner animation="border" /> 
  }

  return (
    <Router>
      {/* Navbar only shown when authenticated */}
        <BookNookNavbar 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout} 
          token={token} // Add userId if needed in navbar
        />

      <Routes>
        {/* Default route redirects based on authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/AllReadinglist" /> : <Auth handleLogin={handleLogin} />
          } 
        />
        
        {/* Protected Home Route */}
        <Route 
          path="/AllReadinglist" 
          element={
            isAuthenticated ? <Readinglistpage token={token}  /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/CompletedReadinglist" 
          element={
            isAuthenticated ? <CompletedReadinglist token={token}  /> : <Navigate to="/" />
          } 
        />


         {/* Protected Home Route */}
        <Route 
          path="/InprogressReadinglist" 
          element={
            isAuthenticated ? <InprogressReadinglist token={token}  /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/NotStartedreadinglist" 
          element={
            isAuthenticated ? <NotStartedreadinglist token={token}  /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/Readinglist" 
          element={
            isAuthenticated ? <Readinglistpage token={token}  /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/reading-list/:listId" 
          element={
            isAuthenticated ? <SingleReadingListPage token={token} /> : <Navigate to="/" />
          } 
        />

        {/* Protected Home Route */}
        <Route 
          path="/Books" 
          element={
            isAuthenticated ? <Bookpage token={token} /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/AllReadBooks" 
          element={
            isAuthenticated ? <ReadBookpage token={token} /> : <Navigate to="/" />
          } 
        />

         {/* Protected Home Route */}
        <Route 
          path="/AllReadingBooks" 
          element={
            isAuthenticated ? <ReadingBookpage token={token} /> : <Navigate to="/" />
          } 
        />

          {/* Protected Home Route */}
        <Route 
          path="/FavoriteBooks" 
          element={
            isAuthenticated ? <Bookpage token={token} /> : <Navigate to="/" />
          } 
        />

        {/* Protected Home Route */}
        <Route 
          path="/Dashboard" 
          element={
            isAuthenticated ? <Dashboard/> : <Navigate to="/" />
          } 
        />

        {/* Protected Home Route */}
        <Route 
          path="/Profile" 
          element={
            isAuthenticated ? <Profilepage/> : <Navigate to="/" />
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
