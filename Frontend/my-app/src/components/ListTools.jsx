import React, { useState } from "react";
import "./ListTools.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

const ToolGrid = ({ tools }) => {
  const [showQR, setShowQR] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [currentToolId, setCurrentToolId] = useState(null);

  const navigate = useNavigate();
  console.log(tools);

  const handleQRClick = (qrImage,id) => {
    setShowQR(true);
    setCurrentQR(qrImage);
    setCurrentToolId(id);
  };

  const closeModal = () => {
    setShowQR(false);
    setCurrentQR('');
  };

  return (
    <div>
      <div className="tool-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <img
              src={`data:image/jpeg;base64,${tool.photo}`}
              alt={tool.name}
              className="tool-image"
            />
            <div className="tool-info">
              <h3>{tool.name}</h3>
              <p><strong>Modelo:</strong> {tool.model}</p>
              <p><strong>Serial:</strong> {tool.no_serie}</p>
              <p><strong>Fecha de mantenimiento:</strong> {tool.manteni}</p>
              <button onClick={() => handleQRClick(tool.qr_image,tool.id)}>Ver QR</button>
            </div>
          </div>
        ))}
      </div>

      {showQR && (
        <div className="qr-modal" onClick={closeModal}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>QR Code</h2>
            <img src={`data:image/png;base64,${currentQR}`} alt="QR Code" className="qr-image" />
            <a href={`data:image/png;base64,${currentQR}`} download="tool-qr.png">Descargar QR</a>
            <br />
            <button onClick={() => navigate(`/tool-details/${currentToolId}`)}>Ver más detalles</button>
            <button onClick={closeModal} className="">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolGrid;
