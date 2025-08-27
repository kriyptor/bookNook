import { Card, Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';

const BookCard = ({ title, author, status, imageUrl = 'https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg', onEditDetails, onUpdateStatus, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Reading': return 'primary';
      case 'Read': return 'success';
      case 'To Read': return 'secondary';
      default: return 'light';
    }
  };

  return (
    <Card className="h-100 shadow-sm position-relative d-flex flex-column">
      <Button
        variant="warning"
        size="sm"
        className="position-absolute top-0 end-0 m-2 rounded"
        onClick={onEditDetails}
        title="Edit Book Details"
      >
        <PencilSquare size={16} />
      </Button>
      <div className="d-flex p-3 flex-grow-1">
        <div className="flex-shrink-0 me-3">
          <Card.Img 
            style={{ width: '100px', height: '150px', objectFit: 'cover' }} 
            src={imageUrl} 
            alt="Book Cover"
            className="rounded shadow-sm"
          />
        </div>
        <div className="flex-grow-1">
          <Card.Body className="p-0 pt-3">
            <Card.Title className="fs-5 mb-2" style={{ paddingRight: '40px' }}>{title}</Card.Title>
            <Card.Subtitle className="text-muted mb-2">{author}</Card.Subtitle>
            <div className="mt-3">
              <span className={`badge bg-${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </Card.Body>
        </div>
      </div>
      <Card.Footer className="d-flex justify-content-between mt-auto">
        <Button 
          variant="primary" 
          onClick={onUpdateStatus}
        >
          Update Status
        </Button>
        <Button 
          variant="outline-danger" 
          onClick={onDelete}
        >
          Delete
        </Button>
      </Card.Footer>
    </Card> 
  );
};

export default BookCard;