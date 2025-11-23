import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("usuario");
    const [userRole, setUserRole] = useState(""); 
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); 
    const [avatar, setAvatar] = useState(null); // Avatar
    const fileInputRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loginToastShown");
        navigate("/login");
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setIsLoading(false);

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data?.nombre) setUserName(response.data.nombre);
                if (response.data?.rol) setUserRole(response.data.rol);

            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchQuote = async () => {
            try {
                const response = await axios.get("https://api.allorigins.win/get?url=https://zenquotes.io/api/random");
                const data = JSON.parse(response.data.contents);
                const { q: frase, a: autor } = data[0];

                const traduccion = await axios.get(
                    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(frase)}&langpair=en|es`
                );

                const fraseTraducida = traduccion.data.responseData.translatedText;

                setQuote({ texto: `"${fraseTraducida}"`, autor });
            } catch (error) {
                console.error("Error al obtener la frase motivadora:", error);
            }
        };

        fetchUserInfo();
        fetchQuote();

        const token = localStorage.getItem("token");
        const toastShownBefore = localStorage.getItem("loginToastShown");

        if (token && !toastShownBefore) {
            localStorage.setItem("loginToastShown", "true");
            setTimeout(() => {
                toast.success("Inicio de sesión exitoso 🎉", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }, 0);
        }
    }, []);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="dashboard-section">
            <ToastContainer />

            {/* BOTÓN 3 LÍNEAS */}
            <button
                className={`hamburger-btn ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* MENÚ DESLIZABLE */}
            <nav className={`side-menu ${menuOpen ? "show" : ""}`}>

  {/* SECCIÓN SUPERIOR: Menú + Avatar */}
  <div className="menu-header">
    <h3 className="menu-title">Menú</h3>

    <div className="avatar-section">
      <div className="avatar-container" onClick={handleFileClick}>
        {avatar ? (
          <img src={avatar} alt="Avatar" className="avatar-img" />
        ) : (
          <span className="default-avatar">👤</span>
        )}
        <div className="avatar-overlay">
          <i className="fa fa-camera"></i>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="input-file-hidden"
        accept="image/*"
      />
    </div>
  </div>

  {/* BOTONES ALINEADOS A LA IZQUIERDA */}
  <div className="menu-buttons">
    <button onClick={() => navigate("/Dashboard")}>Inicio</button>
    <button onClick={() => navigate("/MUsuario")}>Mi cuenta</button>
    <button onClick={() => {}}>Favoritos</button>
    <button onClick={() => {}}>Ajustes</button>
    <button onClick={handleLogout}>Cerrar sesión</button>
  </div>
</nav>


            {/* FONDO OSCURECIDO */}
            <div
                className={`menu-overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* CONTENIDO ORIGINAL */}
            <div className="dashboard-header">
                <div className="logout-container"></div>

                {isLoading ? (
                    <h2>Cargando...</h2>
                ) : (
                    <h2>¡Bienvenido de nuevo, {userName}!</h2>
                )}

                <p>Explora lo mejor de tu comunidad universitaria.</p>

                {quote && (
                    <div className="motivational-quote" data-aos="fade-up">
                        <p className="quote-text">{quote.texto}</p>
                        <p className="quote-author">- {quote.autor}</p>
                    </div>
                )}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card events-card" data-aos="fade-up">
                    <h3 className="card-title">Eventos en tu U 🎉</h3>
                    <p>Descubre los próximos eventos en tu campus y únete a la diversión.</p>
                    <button className="dashboard-btn">Ver Eventos</button>
                </div>

                <div className="dashboard-card groups-card" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="card-title">Grupos y Comunidades 🤝</h3>
                    <p>Únete a clubes y comunidades con tus mismos intereses.</p>
                    <button className="dashboard-btn">Explorar Grupos</button>
                </div>

                <div className="dashboard-card matches-card" data-aos="fade-up" data-aos-delay="400">
                    <h3 className="card-title">Tus Posibles Matches 💖</h3>
                    <p>Conecta con estudiantes que comparten tu vibe.</p>
                    <button
                        className="dashboard-btn"
                        onClick={() => navigate("/matches")}
                    >
                        Ver Matches
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
