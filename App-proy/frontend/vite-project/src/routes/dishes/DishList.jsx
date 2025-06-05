import React, { useState, useEffect } from 'react';
import './DishList.css';

function DishList() {
  const [dishes, setDishes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/getDishes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setDishes(res.data))
      .catch(err => console.error('Error al cargar los platos', err));
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  // Agrupar por categoría
  const groupedByCategory = dishes.reduce((groups, dish) => {
    const category = dish.category || 'Sin categoría';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(dish);
    return groups;
  }, {});

  return (
    <div className="dish-list-container">
      <h1>Lista de Platos</h1>
      {Object.entries(groupedByCategory).map(([category, dishesInCategory]) => (
        <div key={category} className="dish-category-group">
          <h2 className="dish-category-title">{category}</h2>
          <ul className="dish-list">
            {dishesInCategory.map((dish) => (
              <li key={dish._id} className="dish-item" onClick={() => toggleExpand(dish._id)}>
                <div className="dish-summary">
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">{dish.price} €</span>
                </div>
                {expandedId === dish._id && (
                  <div className="dish-details">
                    <div className="dish-info">
                      <p>{dish.description}</p>
                      <p>Alérgenos: {dish.allergens}</p>
                    </div>
                    {dish.image && (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="dish-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageModal(dish.image);
                        }}
                      />
                    )}
                    {modalImage && (
                      <div className="image-modal-backdrop" onClick={closeImageModal}>
                        <img
                          src={modalImage}
                          alt="Plato ampliado"
                          className="image-modal"
                          onClick={(e) => e.stopPropagation()} // evita que se cierre si haces clic en la imagen
                        />
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DishList;
