import React from 'react';
import { Card, Button } from 'react-bootstrap';


const getStatusColor = (status) => {
  switch (status) {
    case 'Reading':
      return 'primary';
    case 'Read':
      return 'success';
    case 'To Read':
      return 'secondary';
    default:
      return 'light';
  }
};

const BookCard = ({ title, author, status, imageUrl = 'https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg', onEdit, onDelete }) => {
    return (
    <Card className="h-100 shadow-sm">
              <div className="d-flex p-3">
                <div className="flex-shrink-0 me-3">
                  <Card.Img 
                    style={{ width: '100px', height: '150px', objectFit: 'cover' }} 
                    src={imageUrl} 
                    alt="Book Cover"
                    className="rounded shadow-sm"
                  />
                </div>
                <div className="flex-grow-1">
                  <Card.Body className="p-0">
                    <Card.Title className="fs-5">{title}</Card.Title>
                    <Card.Subtitle className="text-muted">{author}</Card.Subtitle>
                    <div className="mt-3">
                      <span className={`badge bg-${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  </Card.Body>
                </div>
              </div>
              <Card.Footer className="d-flex justify-content-between">
                <Button 
                  variant="outline-primary" 
                  onClick={onEdit} // Attach the handler here
                >
                  Edit Details
                </Button>
                <Button 
                  variant="danger" 
                  onClick={onDelete} // Attach the handler here
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card> 
  );
};

export default BookCard;