import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, text) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "Restaurante Carbónico",
        email: process.env.EMAIL_USER,
      },
      to: [
        { email: to }
      ],
      subject,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
};


export default sendEmail;