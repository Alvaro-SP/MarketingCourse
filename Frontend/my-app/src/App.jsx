import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterTool from "./components/RegisterTool";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", { username, password });
      navigate("/login");
    } catch (error) {
      console.error("Error en registro", error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error en login", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

const Tools = () => {
  const [tools, setTools] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/tools", { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setTools(response.data))
      .catch(error => console.error("Error al obtener herramientas", error));
  }, [token]);

  return (
    <div>

<RegisterTool />
      <h1>Mis Herramientas</h1>
      <ul>
        {tools.map(tool => (
          <li key={tool.id}>
            <p><strong>{tool.name}</strong></p>
            <img src={`http://localhost:5000/${tool.qr_code}`} alt="QR Code" />
          </li>
        ))}
      </ul>
    </div>
  );
};



const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Tools />} />} />
      </Routes>
    </Router>
  );
};

export default App;
