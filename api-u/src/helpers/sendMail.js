import sendMail from "../config/nodemailer.js";

const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        "Bienvenido a Vibe-U 🎓",
        `
            <h1>Confirma tu cuenta</h1>
            <p>¡Hola! Gracias por unirte a <b>Vibe-U</b>, la app que pone a la U en modo social.</p>
            <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_BACKEND}/confirmar/${token}">
                Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de Vibe-U te da la más cordial bienvenida 💜</footer>
        `
    );
};

export { sendMailToRegister };
