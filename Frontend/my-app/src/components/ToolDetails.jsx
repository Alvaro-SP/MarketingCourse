import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ToolDetails.css";
const url = "http://34.207.166.97:5000"

const ToolDetails = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
    
  useEffect(() => {
    // Simula una petición a una API para obtener la información de la herramienta
    fetch(url +`/tools/${id}`)
      .then((res) => res.json())
      .then((data) => setTool(data.tools[0]))
      .catch((err) => console.error("Error al obtener datos:", err));
  }, [id]);

  if (!tool) {
    return <p>Cargando...</p>
  }
  else (
    console.log(tool)
  ) ;

  return (
    <div className="tool-details">
      <h2>{tool.name}</h2>
      <img src={`data:image/jpeg;base64,${tool.photo}`} alt={tool.name} className="tool-imagexd" />
      <p><strong>Modelo:</strong> {tool.model}</p>
      <p><strong>Serial:</strong> {tool.no_serie}</p>
      <p><strong>Propietario:</strong> {tool.own}</p>
      <p><strong>Descripción:</strong> {tool.description}</p>
      <p><strong>Último mantenimiento:</strong> {tool.manteni}</p>
      
      {/* Notificación si la fecha de mantenimiento está cerca */}
      {new Date(tool.manteni) < new Date() ? (
        <p className="alert">⚠️ Esta herramienta requiere mantenimiento urgente.</p>
      ) : (
        <p>📅 Próximo mantenimiento: {tool.manteni}</p>
      )}
    </div>
  );
};

export default ToolDetails;
