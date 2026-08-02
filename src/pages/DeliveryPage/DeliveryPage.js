import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import './DeliveryPage.css';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const { gameId, wonGift, userDetails, step, loading } = useGame();

  useEffect(() => {
    if (loading) return;
    if (!gameId || !wonGift || !userDetails) {
      navigate('/');
      return;
    }
    if (step >= 3) {
      navigate('/bringpackage');
      return;
    }
    if (step < 2) {
      navigate(step === 1 ? '/spin' : '/');
      return;
    }
  }, [loading, gameId, wonGift, userDetails, step, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!gameId || !wonGift || !userDetails) return null;

  return (
    <div className="delivery-page">
      <h2>Delivery Details</h2>
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Address:</strong> {userDetails.address}, {userDetails.country}</p>
      <div className="prize-info">
        <img src={wonGift.image} alt={wonGift.name} />
        <p>{wonGift.name}</p>
      </div>
      <p className="message">
        Your <strong>{wonGift.name}</strong> will be sent and delivered to <em>{userDetails.address}, {userDetails.country}</em>. 
        Kindly click the "Bring Package" button now for our delivery service to bring your prize to you.
      </p>
      <button className="bring-btn" onClick={() => navigate('/bringpackage')}>
        Bring Package
      </button>
    </div>
  );
};

export default DeliveryPage;