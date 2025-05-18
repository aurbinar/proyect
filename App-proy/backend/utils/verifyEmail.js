import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function verifyEmailAddress(email) {
  try {
    const response = await axios.get('https://emailvalidation.abstractapi.com/v1/?', {
      params: {
        api_key: process.env.ABSTRACT_API_KEY,
        email: email,
      },
    });
    const data = response.data;

    return (
      data.deliverability === 'DELIVERABLE' &&
      data.is_valid_format.value &&
      data.is_smtp_valid.value &&
      !data.is_disposable_email.value
    );
  } catch (error) {
    console.error('Error al verificar el correo electrónico:', error.message);
    return false;
  }
}

export default verifyEmailAddress;