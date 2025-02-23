import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterTool.css";
const url = "http://34.207.166.97:5000";
const RegisterTool = () => {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [no_serie, setNo_serie] = useState("");
  const [own, setOwn] = useState("");
  const [manteni, setManteni] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);


  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
        alert("Selecciona una imagen.");
        return;
      }
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("model", model);
      formData.append("no_serie", no_serie);
      formData.append("own", own);
      formData.append("manteni", manteni);
      formData.append("photo", photo); // Aquí enviamos la imagen como BLOB
      formData.append("description", description); // Aquí enviamos la imagen como BLOB
  
      try {
          const response = await fetch(url+"/tool", {
              method: "POST",
              body: formData, // Importante: no colocar headers 'Content-Type', Fetch lo hará automáticamente.
          });
  
          const result = await response.json();
          console.log(result);
      } catch (error) {
          console.error("Error al enviar los datos:", error);
      }
    // Limpiar el formulario y actualizar la lista de herramientas
    setName("");
    setModel("");
    setNo_serie("");
    setOwn("");
    setManteni("");
    setDescription("");
    setPhoto(null);
    // fetchTools();
    setShowModal(false); // Cerrar el modal después de agregar la herramienta
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold">Gestión de Herramientas</h1> */}
      
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Registrar Herramienta
      </Button>

      {/* Modal con CSS */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Herramienta</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Modelo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Número de Serie"
                value={no_serie}
                onChange={(e) => setNo_serie(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Propietario"
                value={own}
                onChange={(e) => setOwn(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Fecha Mantenimiento DD/MM/AAAA"
                value={manteni}
                onChange={(e) => setManteni(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                required
              />
              <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              />
              <div className="modal-footer">
                <button type="submit" className="submit-button">
                  Añadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterTool;
