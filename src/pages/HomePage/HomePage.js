import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { validateGameId } from '../../services/api';
import PopupModal from '../../components/PopupModal';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { setGameId, loading } = useGame(); // removed unused gameId, step, setStep
  const [showPopup, setShowPopup] = useState(false);
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');

  if (loading) return <div className="loading">Loading...</div>;

  const handleStartGame = () => {
    setShowPopup(true);
    setError('');
    setInputId('');
  };

  const handleContinue = async () => {
    if (!inputId.trim()) {
      setError('Please enter a game ID');
      return;
    }
    try {
      await validateGameId(inputId.trim());
      setGameId(inputId.trim());
      setShowPopup(false);
      navigate('/spin');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Incorrect game ID. Please contact the game admin for a correct game ID.');
      } else {
        setError('Error validating game ID. Try again.');
      }
    }
  };

  return (
    <div className="homepage">
      <section className="section-1">
        <h1>GameContest</h1>
      </section>
      <section className="section-2">
        <button className="start-btn" onClick={handleStartGame}>
          Start Game
        </button>
      </section>
      <section className="section-3">
        <p>
        You are allowed to spin once. Your prize won will be sent and delivered to you. 
        We use this platform for the contest to make the game free and fair. You are not 
        allowed to share the link of the game or your game ID with anyone. You will get 
        a delivery ID at the end; copy it and send it to our delivery system to get your package.
        </p>
      </section>

      {showPopup && (
        <PopupModal onClose={() => setShowPopup(false)}>
          <h3>Enter Game ID</h3>
          <input
            type="text"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Game ID"
          />
          {error && <p className="error">{error}</p>}
          <button onClick={handleContinue}>Continue</button>
        </PopupModal>
      )}
    </div>
  );
};

export default HomePage;