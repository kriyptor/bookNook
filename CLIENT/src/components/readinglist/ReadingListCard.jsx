import { Card, Button, ProgressBar } from "react-bootstrap";

function ReadingListCard({ title, status, color, totalBooks, completion, onView, onDelete }) {
  let progressText = "Not Started";
  let variant = "secondary";

  if (completion > 0 && completion < 100) {
    progressText = `${completion}% Completed`;
    variant = "warning";
  } else if (completion === 100) {
    progressText = "Completed";
    variant = "success";
  }

  return (
    <Card className="h-100 shadow-sm border-1 rounded">
      <Card.Body className="p-4">
        <Card.Title className="fs-5 fw-bold mb-3 text-primary">{title.toUpperCase()}</Card.Title>
        <Card.Subtitle className="text-muted mb-3">
          {totalBooks} book{totalBooks !== 1 ? 's' : ''}
        </Card.Subtitle>
        <div className="mb-3">
          <span className={`badge bg-${color} fs-6 px-3 py-2`}>{status}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <small className="fw-semibold text-secondary">Progress</small>
          <small className="fw-bold">{progressText}</small>
        </div>
        <ProgressBar 
          now={completion} 
          variant={variant} 
          className="rounded-pill" 
          style={{ height: '8px' }} 
        />
      </Card.Body>
      <Card.Footer className=" d-flex justify-content-between">
        <Button variant="primary" onClick={onView} >View List</Button>
        <Button variant="outline-danger" onClick={onDelete} >Delete List</Button>
      </Card.Footer>
    </Card>
  );
}

export default ReadingListCard;