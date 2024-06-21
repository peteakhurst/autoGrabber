import { useLocation } from 'react-router-dom';
import './App.css';

function Upload() {
  const location = useLocation();
  const { make, model, badge, logbookContent } = location.state || {};

  return (
    <div>
      <h1>Upload Details</h1>
      <p>
        <strong>Make:</strong> {make}
      </p>
      <p>
        <strong>Model:</strong> {model}
      </p>
      <p>
        <strong>Badge:</strong> {badge}
      </p>
      <div>
        <strong>Logbook Content:</strong>
        <pre>{logbookContent}</pre>
      </div>
    </div>
  );
}

export default Upload;
