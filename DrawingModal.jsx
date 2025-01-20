import React, { useState } from 'react';
import Modal from 'react-modal';
import { LineString } from 'ol/geom';
import { Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';  // Correct import for VectorSource
import VectorLayer from 'ol/layer/Vector';  // Correct import for VectorLayer
import { fromLonLat } from 'ol/proj';

const DrawingModal = ({ isOpen, coordinates, isPolygon, closeModal, onGenerate, onInsertPolygon }) => {
  const [showDropdown, setShowDropdown] = useState(null); // State to track which waypoint's dropdown is open

  const calculateDistance = (coords, index) => {
    if (index === 0) return 0;
    const prevCoord = coords[index - 1];
    const currCoord = coords[index];
    // Haversine formula to calculate the distance between two latitude/longitude points
    const R = 6371e3; // Earth radius in meters
    const lat1 = prevCoord[1] * (Math.PI / 180);
    const lat2 = currCoord[1] * (Math.PI / 180);
    const deltaLat = (currCoord[1] - prevCoord[1]) * (Math.PI / 180);
    const deltaLon = (currCoord[0] - prevCoord[0]) * (Math.PI / 180);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to handle inserting a polygon at a specific position
  const handleInsertPolygon = (position) => {
    // Trigger the map to allow polygon drawing at the specified position
    onInsertPolygon(position); // Pass position (before or after waypoint) to parent
    setShowDropdown(null); // Close the dropdown after selection
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          width: '600px',
          margin: 'auto',
          padding: '20px',
        },
      }}
    >
      <h3>Mission Modal</h3>
      <h4>{isPolygon ? 'Polygon Waypoints' : 'LineString Waypoints'}</h4>
      <div>
        <table>
          <thead>
            <tr>
              <th>WP</th>
              <th>Coordinates (Longitude, Latitude)</th>
              <th>Distance (meters)</th>
              <th>Actions</th> {/* Add actions column */}
            </tr>
          </thead>
          <tbody>
            {coordinates.map((coord, index) => {
              const distance = calculateDistance(coordinates, index).toFixed(2);
              return (
                <tr key={index}>
                  <td>WP({String(index).padStart(2, '0')})</td>
                  <td>{`(${coord[0].toFixed(8)}, ${coord[1].toFixed(8)})`}</td>
                  <td>{distance}</td>
                  <td>
                    <button onClick={() => setShowDropdown(index)}>⋮</button>
                    {showDropdown === index && (
                      <div style={{ position: 'absolute', zIndex: 999, backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px' }}>
                        <button onClick={() => handleInsertPolygon('before')}>Insert Polygon Before</button>
                        <button onClick={() => handleInsertPolygon('after')}>Insert Polygon After</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Information box below the table */}
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Click on the map to mark points of the route and then press <strong>Enter</strong> to complete the route.
        </p>
      </div>

      {/* Generate button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={onGenerate} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: "lightblue" }}>
          Generate Route
        </button>
      </div>

      <button onClick={closeModal} style={{ float: 'right', marginTop: '20px' }}>
        Close
      </button>
    </Modal>
  );
};

export default DrawingModal;
