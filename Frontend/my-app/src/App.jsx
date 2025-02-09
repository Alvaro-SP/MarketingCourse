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
  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const response = await axios.get("http://localhost:5000/tool");
    setTools(response.data);
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

    try {
        const response = await fetch("http://localhost:5000/tool", {
            method: "POST",
            body: formData, // Importante: no colocar headers 'Content-Type', Fetch lo hará automáticamente.
        });

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("Error al enviar los datos:", error);
    }
      
    setName("");
    setModel("");
    setNo_serie("");
    setOwn("");
    setManteni("");
    setDescription("");
    setPhoto(null);
    // fetchTools();
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
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
