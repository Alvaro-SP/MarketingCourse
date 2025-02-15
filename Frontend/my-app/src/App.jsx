import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterTool from "./components/RegisterTool";
import ListTools from "./components/ListTools";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import './App.css';
import ToolDetails from "./components/ToolDetails"; // La nueva página de detalles

const url = "http://3.95.32.99:5000"
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(url+":5000/register", { username, password });
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
    alert("Bienvenido");
    e.preventDefault();
    try {
      const response = await axios.post(url+"/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error en login", error);
      alert(error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" >Iniciar sesión</button>
      </form>
      <footer>MERCADOTECNIA 1, USAC</footer>
    </div>
  );
};

const QrScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrResult, setQrResult] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    // 📌 Pedir permisos explícitos en móviles
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch((err) => {
        console.error("No se pudo acceder a la cámara:", err);
        setHasPermission(false);
      });
  }, []);
  useEffect(() => {
    if (!hasPermission) return;
    const scanQRCode = () => {
      if (webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video;
        if (video.readyState === 4) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            console.log("QR detectado", code.data);
            alert("qr detectado");
            setQrResult(code.data);
          }
        }
      }
    };
    console.log("scan");

    const interval = setInterval(scanQRCode, 500); // Escanea cada 500ms
    return () => clearInterval(interval);
  }, [hasPermission]);

  return (
    <div>
      {!hasPermission ? (
        <button onClick={() => window.location.reload()}>
          🔄 Activar Cámara
        </button>
      ) : (
        <>
          <Webcam ref={webcamRef} width={300} height={300} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {qrResult && <p>📸 QR Detectado: {qrResult}</p>}
        </>
      )}
    </div>
  );
}

const Tools = () => {
  
  const [tools, setTools] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchTools();
  }, []);
  const fetchTools = async () => {
    const response = await axios.post(url + "/tools", {idusuario: 1});
    setTools(response.data.tools);
    console.log(response.data);
  };

  // useEffect(() => {
  //   if (!token) return;
  //   axios.get(url+"/tools", { headers: { Authorization: `Bearer ${token}` } })
  //     .then(response => setTools(response.data))
  //     .catch(error => console.error("Error al obtener herramientas", error));
  // }, [token]);

  return (
    <div>

      <RegisterTool />
      <h1>Mis Herramientas</h1>
      <ListTools tools={tools} />
      <footer>MERCADOTECNIA 1, USAC</footer>
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
        <Route path="/qrscanner" element={<QrScanner />} />
        <Route path="/" element={<PrivateRoute element={<Tools />} />} />
        <Route path="/tool-details/:id" element={<ToolDetails />} />

      </Routes>
    </Router>
  );
};

export default App;
