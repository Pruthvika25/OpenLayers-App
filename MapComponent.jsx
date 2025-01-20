import React, { useState, useRef, useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Draw from 'ol/interaction/Draw';
import { LineString, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DrawingModal from './DrawingModal';  // Importing the modal component

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [isPolygon, setIsPolygon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null); // Track where the polygon should be inserted (before/after)

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const drawInteraction = useRef(null);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: new VectorSource(),
          }),
        ],
        view: new View({
          center: fromLonLat([12.9716, 77.5946]), // Example center (Bangalore)
          zoom: 10,
        }),
      });
    }
  }, []);

  const startDrawing = (type) => {
    const source = new VectorSource();

    if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }

    const draw = new Draw({
      source,
      type,
    });

    draw.on('drawend', (e) => {
      const geom = e.feature.getGeometry();
      if (type === 'Polygon') {
        const polygonCoordinates = geom.getCoordinates()[0]; // Extract the polygon coordinates
        setCoordinates(polygonCoordinates);
      } else {
        setCoordinates(geom.getCoordinates());
      }
      setShowModal(true);
      setIsPolygon(type === 'Polygon');
    });

    mapInstance.current.addInteraction(draw);
    drawInteraction.current = draw;
  };

  // Handle polygon insertion (before/after waypoint)
  const handleInsertPolygon = (position) => {
    setInsertPosition(position); // Save the position where the polygon should be inserted
    setDrawingPolygon(true);
    startDrawing('Polygon'); // Start polygon drawing
  };

  const handleDrawButtonClick = () => {
    startDrawing('LineString');
  };

  const handleGenerateRoute = () => {
    // Handle route generation (could be saving or exporting the route)
    console.log('Route generated:', coordinates);
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleDrawButtonClick}>
        Start Drawing LineString
      </button>

      <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>

      <DrawingModal
        isOpen={showModal}
        coordinates={coordinates}
        isPolygon={isPolygon}
        closeModal={() => setShowModal(false)}
        onGenerate={handleGenerateRoute}
        onInsertPolygon={handleInsertPolygon} // Pass the handleInsertPolygon function
      />
    </div>
  );
};

export default MapComponent;
