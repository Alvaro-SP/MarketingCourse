import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [tools, setTools] = useState([]);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [no_serie, setNo_serie] = useState("");
  const [own, setOwn] = useState("");
  const [manteni, setManteni] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const response = await axios.get("http://localhost:5000/tool");
    setTools(response.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      model,
      no_serie: no_serie,
      own,
      manteni,
      description,
      photo, // Enviado como base64 (sin encabezado)
    };
  
    await axios.post("http://localhost:5000/tool", data, {
      headers: { "Content-Type": "application/json" },
    });
    
    setName("");
    setModel("");
    setNoSerie("");
    setOwn("");
    setManteni("");
    setDescription("");
    setPhoto(null);
    fetchTools();
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Gestión de Herramientas</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 m-2" />
        <input type="text" placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} className="border p-2 m-2" />
        <input type="text" placeholder="Número de Serie" value={no_serie} onChange={(e) => setNo_serie(e.target.value)} className="border p-2 m-2" />
        <input type="text" placeholder="Propietario" value={own} onChange={(e) => setOwn(e.target.value)} className="border p-2 m-2" />
        <input type="text" placeholder="Mantenimiento" value={manteni} onChange={(e) => setManteni(e.target.value)} className="border p-2 m-2" />
        <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 m-2" />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="border p-2 m-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Añadir</button>
      </form>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id} className="border p-2 my-2">
            <p><strong>{tool.name}</strong></p>
            <p>{tool.description}</p>
            <img src={`http://localhost:8000/${tool.qr_code}`} alt="QR Code" className="w-24 h-24" />
            {tool.photo && <img src={`http://localhost:8000/${tool.photo}`} alt="Tool" className="w-24 h-24" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
