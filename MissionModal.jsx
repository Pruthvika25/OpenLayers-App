// MissionModal.jsx
import React from 'react';

const MissionModal = ({ waypoints, onClose }) => {
  if (!waypoints || waypoints.length === 0) {
    return <div>No waypoints available.</div>;
  }

  return (
    <div className="modal" style={modalStyle}>
      <h2>Mission Waypoints</h2>
      <ul>
        {waypoints.map((wp, index) => (
          <li key={index}>
            WP({wp.wp < 10 ? `0${wp.wp}` : wp.wp}):{' '}
            Coordinates({wp.coordinates[0].toFixed(6)}, {wp.coordinates[1].toFixed(6)}), Distance: {wp.distance} meters
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onClose}>Close</button>
        <button>Generate</button>
      </div>
    </div>
  );
};

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  width: '300px',
};

export default MissionModal;
