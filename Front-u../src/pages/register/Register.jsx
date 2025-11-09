import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetch } from "../../hooks/useFetch";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const fetchDataBackend = useFetch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // 🔹 Registro en backend
    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/register`;

        // Mapear los campos del formulario a lo que espera tu backend
        const body = {
            nombre: dataForm.name,
            correoInstitucional: dataForm.email,
            password: dataForm.password
        };

        try {
            const response = await fetchDataBackend(url, body, "POST");

            if (response) {
                toast.success(response.msg || "Registro exitoso 🎉", {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Redirigir al login después de registrarse
                navigate("/login");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Únete a Vibe-U</h2>
                <p className="register-subtitle">Crea tu cuenta para empezar a conectar.</p>

                <form className="register-form" onSubmit={handleSubmit(registerUser)}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Nombre"
                            autoComplete="name"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                        {errors.name && <span className="error-text">{errors.name.message}</span>}
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email universitario"
                            autoComplete="email"
                            {...register("email", { required: "El email es obligatorio" })}
                        />
                        {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            autoComplete="new-password"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="register-btn">Registrarse</button>
                </form>

                <NavLink to="/login" className="login-link">
                    ¿Ya tienes cuenta? Inicia sesión
                </NavLink>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Register;
