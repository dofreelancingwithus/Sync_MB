import React from 'react';
import { Button } from 'react-bootstrap';

const MoodInputSelector = ({ onTextSelect, onCameraSelect }) => {
  return (
    <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
      <Button
        variant="primary"
        size="lg"
        onClick={onTextSelect}
        className="px-4 py-2"
      >
        Text Input
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={onCameraSelect}
        className="px-4 py-2"
      >
        Camera
      </Button>
    </div>
  );
};

export default MoodInputSelector;