import React from 'react';
import './GiftPopup.css';

const GiftPopup = ({ gift, onClose }) => {
  return (
    <div className="gift-popup-overlay">
      <div className="gift-popup">
        <h2>Congratulations!</h2>
        <img src={gift.image} alt={gift.name} />
        <h3>{gift.name}</h3>
        <button onClick={onClose}>Get My Prize</button>
      </div>
    </div>
  );
};

export default GiftPopup;