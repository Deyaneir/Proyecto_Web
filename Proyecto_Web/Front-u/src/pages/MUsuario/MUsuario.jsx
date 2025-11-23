import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MUsuario.css';

const MUsuario = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");
  const [userStatus, setUserStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("favoritos");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const avatarOptions = [
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar1",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar2",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar3",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar4",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Avatar5"
  ];
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCedula, setUserCedula] = useState("");
  const [userGmail, setUserGmail] = useState("");
  const [userInstitutionalEmail, setUserInstitutionalEmail] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userUniversity, setUserUniversity] = useState("");
  const [userCareer, setUserCareer] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/perfil`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.nombre) setUserName(response.data.nombre);
        if (response.data?.estado) setUserStatus(response.data.estado);
        if (response.data?.avatar) setAvatar(response.data.avatar);
        if (response.data?.telefono) setUserPhone(response.data.telefono);
        if (response.data?.direccion) setUserAddress(response.data.direccion);
        if (response.data?.cedula) setUserCedula(response.data.cedula);
        if (response.data?.gmail) setUserGmail(response.data.gmail);
        if (response.data?.correo_institucional) setUserInstitutionalEmail(response.data.correo_institucional);
        if (response.data?.descripcion) setUserDescription(response.data.descripcion);
        if (response.data?.universidad) setUserUniversity(response.data.universidad);
        if (response.data?.carrera) setUserCareer(response.data.carrera);

      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUserInfo();
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector(".side-menu");
      const hamburger = document.querySelector(".hamburger-btn");

      if (menuOpen && menu && !menu.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const renderRightContent = () => {
    switch (activeTab) {
      case "cuenta":
        return (
          <div className="profile-container">
            <h3>Mi Cuenta</h3>

            <div className="profile-avatar-container" style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
              <div
                className="avatar-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#ddd",
                  flexShrink: 0
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="default-avatar" style={{ fontSize: "80px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>👤</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <div>
                  <button
                    onClick={handleFileClick}
                    style={{ padding: "8px 12px", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}
                  >
                    Subir foto
                  </button>
                  <button
                    onClick={() => setAvatarModalOpen(!avatarModalOpen)}
                    style={{ padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Elegir avatar
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="input-file-hidden"
                    accept="image/*"
                  />
                </div>

                {avatarModalOpen && (
                  <div
                    className="avatar-modal"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      gap: "10px",
                      marginBottom: "15px",
                      padding: "10px",
                      background: "#fff",
                      borderRadius: "10px",
                      boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    {avatarOptions.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Avatar ${i}`}
                        className="avatar-option"
                        onClick={() => {
                          setAvatar(url);
                          setAvatarModalOpen(false);
                        }}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          border: "2px solid transparent",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.borderColor = "#007bff")}
                        onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}
                      />
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ color: "#000" }}>Usuario</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Descripción</label>
                    <textarea value={userDescription} onChange={(e) => setUserDescription(e.target.value)} rows={3} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Teléfono</label>
                    <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Dirección</label>
                    <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Cédula</label>
                    <input type="text" value={userCedula} onChange={(e) => setUserCedula(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Gmail</label>
                    <input type="email" value={userGmail} onChange={(e) => setUserGmail(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Correo institucional</label>
                    <input type="email" value={userInstitutionalEmail} onChange={(e) => setUserInstitutionalEmail(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Universidad</label>
                    <input type="text" value={userUniversity} onChange={(e) => setUserUniversity(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>
                  <div>
                    <label style={{ color: "#000" }}>Carrera</label>
                    <input type="text" value={userCareer} onChange={(e) => setUserCareer(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", backgroundColor: "#fff", color: "#000" }} />
                  </div>

                  <div style={{ textAlign: "center", marginTop: "15px" }}>
                    <button className="profile-options-btn" onClick={() => toast.info("Función de guardar info aún no implementada")} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Guardar cambios</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "favoritos":
        return <div><h3>Favoritos</h3><p>Información de tu cuenta...</p></div>;
      case "chats":
        return <div><h3>Chats</h3><p>Tus conversaciones...</p></div>;
      case "notificaciones":
        return <div><h3>Notificaciones</h3><p>Tus notificaciones...</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="musuario-container">
      <ToastContainer />

      <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} style={{ position: "fixed", top: "10px", left: "10px", zIndex: 2000 }}>
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

      {/* =============================== */}
      {/*  BARRA IZQUIERDA CON AVATAR     */}
      {/* =============================== */}

      <div className="left-panel">
        <div className="left-panel-content">

          {/* Avatar y texto */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto",
                backgroundColor: "#ddd",
              }}
            >
              {avatar ? (
                <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "50px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>👤</span>
              )}
            </div>

            <h3 style={{ color: "#000", marginTop: "10px" }}>{userName}</h3>
            <p style={{ color: "green", marginTop: "-5px" }}>{userStatus}</p>

            <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
          </div>

          {/* Botones */}
          <div className="menu-buttons">
            <button className={activeTab === "cuenta" ? "active" : ""} onClick={() => setActiveTab("cuenta")}>Cuenta</button>
            <button className={activeTab === "favoritos" ? "active" : ""} onClick={() => setActiveTab("favoritos")}>Favoritos</button>
            <button className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>Chats</button>
            <button className={activeTab === "notificaciones" ? "active" : ""} onClick={() => setActiveTab("notificaciones")}>Notificaciones</button>
          </div>
        </div>
      </div>

      <div className="right-panel">
        {renderRightContent()}
      </div>
    </div>
  );
};

export default MUsuario;
