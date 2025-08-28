import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const AuthComponent = ({ handleLogin }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // State for different forms
  const [key, setKey] = useState('signin');
  
  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Sign Up States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Error and Success Message States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation Functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signInEmail || !signInPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signInEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: signInEmail,
        password: signInPassword
      });

      handleLogin(response.data.token);
      setSuccess('Sign in successful!');
      navigate('/AllReadinglist');
    } catch (err) {
      setError('Sign in failed. Please check your credentials.');
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signUpName || !signUpEmail || !signUpPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signUpEmail)) {
      setError('Please enter a valid email address');
      return;
    }

   /*  if (!validatePassword(signUpPassword)) {
      setError('Password must be 8+ characters, include uppercase, lowercase, and number');
      return;
    } */

    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log(BASE_URL)

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword
      });

      setSuccess('Sign up successful! Please sign in.');
      setKey('signin');
    } catch (err) {
      setError('Sign up failed. Please try again.');
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotEmail) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post(`${apiEndPoint}/password/forgot-password`, {
        emailId: forgotEmail
      });
      
      setSuccess('Password reset link sent to your email!');
    } catch (err) {
      setError('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <Container className="my-3">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-1">
            <Card.Body className="p-4">
              <h3 className="text-center mb-3 fw-bold text-bg-primary rounded p-2">Welcome to BookNook</h3>
              <hr />
              {error && <Alert variant="danger" className="rounded-pill">{error}</Alert>}
              {success && <Alert variant="success" className="rounded-pill">{success}</Alert>}

              <Tabs
                id="auth-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
                variant="pills"
                justify
              >
                {/* Sign In Tab */}
                <Tab eventKey="signin" title="Sign In">
                  <Form onSubmit={handleSignIn}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email" 
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="rounded-pill"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type={showSignInPassword ? 'text' : 'password'} 
                          placeholder="Enter your password" 
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          className="rounded-pill rounded-end-0"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="rounded-pill rounded-start-0"
                        >
                          {showSignInPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center">
                      <Button variant="primary" type="submit" className="rounded-pill px-4">
                        Sign In
                      </Button>
                      {/* <Button 
                        variant="link" 
                        onClick={() => setKey('forgotpassword')}
                        className="text-decoration-none"
                      >
                        Forgot Password?
                      </Button> */}
                    </div>
                  </Form>
                </Tab>

                {/* Sign Up Tab */}
                <Tab eventKey="signup" title="Sign Up">
                  <Form onSubmit={handleSignUp}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="rounded-pill"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email" 
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="rounded-pill"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type={showSignUpPassword ? 'text' : 'password'} 
                          placeholder="Create a password" 
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          className="rounded-pill rounded-end-0"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="rounded-pill rounded-start-0"
                        >
                          {showSignUpPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Must be 8+ characters, include uppercase, lowercase, and number
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type={showSignUpPassword ? 'text' : 'password'} 
                          placeholder="Confirm your password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="rounded-pill rounded-end-0"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="rounded-pill rounded-start-0"
                        >
                          {showSignUpPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <Button variant="success" type="submit" className="rounded-pill px-4">
                      Sign Up
                    </Button>
                  </Form>
                </Tab>

                {/* Forgot Password Tab */}
                {/* <Tab eventKey="forgotpassword" title="Forgot Password">
                  <Form onSubmit={handleForgotPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="rounded-pill"
                      />
                      <Form.Text className="text-muted">
                        We'll send a password reset link to this email
                      </Form.Text>
                    </Form.Group>

                    <Button variant="warning" type="submit" className="rounded-pill px-4">
                      Send Reset Link
                    </Button>
                  </Form>
                </Tab> */}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthComponent;