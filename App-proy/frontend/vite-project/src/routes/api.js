// src/api.js
const API_URL = 'http://localhost:5000/api'; // Cambia esto a la URL de tu backend

export const getDishes = async () => {
  const response = await fetch(`${API_URL}/getDishes`);
  return response.json();
};

export const postDish = async (dish) => {
  const response = await fetch(`${API_URL}/postDish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dish),
  });
  return response.json();
};

export const editDish = async (id, updates) => {
  const response = await fetch(`${API_URL}/editDish/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteDish = async (id) => {
  const response = await fetch(`${API_URL}/deleteDish/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
