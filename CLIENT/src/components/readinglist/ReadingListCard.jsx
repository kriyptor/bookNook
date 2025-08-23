import { Card, Button } from "react-bootstrap";

function ReadingListCard({ title, status, color, totalBooks, onView, onDelete }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="fs-5">{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {totalBooks} book(s)
        </Card.Subtitle>
        <div className="mt-3">
          <span className={`badge bg-${color}`}>{status}</span>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={onDelete}>Delete List</Button>
        <Button variant="outline-primary" onClick={onView}>View List</Button>
      </Card.Footer>
    </Card>
  );
}

export default ReadingListCard;
