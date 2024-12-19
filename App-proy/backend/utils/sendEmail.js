import nodemailer from 'nodemailer';

dotenv.config();

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // O usa otro servicio como Outlook, Yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER, // Configura tu email
      pass: process.env.EMAIL_PASS, // Contraseña o clave de aplicación
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;