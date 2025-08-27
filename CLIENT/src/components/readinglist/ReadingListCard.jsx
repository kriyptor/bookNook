import { Card, Button } from "react-bootstrap";

function ReadingListCard({ title, status, color, totalBooks, completion, onView, onDelete }) {

  let progressText = null;

  if(completion === 0){
    progressText = "Not Started";
  }else if(completion > 0 && completion < 100){
    progressText = `${completion}% Completed`;
  }else{
    progressText = "Completed";
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="fs-5">{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {totalBooks} book(s)
        </Card.Subtitle>
        <div className="mt-3">
          <span className={`badge bg-${color}`}>{progressText}</span>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Button variant="primary" onClick={onView}>View List</Button>
        <Button variant="outline-danger" onClick={onDelete}>Delete List</Button>
      </Card.Footer>
    </Card>
  );
}

export default ReadingListCard;
