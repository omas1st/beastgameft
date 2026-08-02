import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { fetchGifts, saveSpinResult } from '../../services/api';
import SpinWheel from '../../components/SpinWheel';
import GiftPopup from '../../components/GiftPopup';
import './SpinPage.css';

const SpinPage = () => {
  const navigate = useNavigate();
  const {
    gameId,
    step,
    updateProgress,
    wonGift,
    setWonGift,
    gifts,
    setGifts,
    loading,
  } = useGame();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(null);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);   // local flag to prevent double spins

  // Redirect / restore page logic
  useEffect(() => {
    if (loading) return;
    if (!gameId) {
      navigate('/');
      return;
    }
    if (step >= 3) {
      navigate('/bringpackage');
      return;
    }
    if (step === 2) {
      navigate('/delivery');
      return;
    }
    // If user already spun earlier and comes back, show the gift popup again
    if (step === 1 && wonGift) {
      setShowGiftPopup(true);
      setCanSpin(false); // no more spins
    }
  }, [loading, gameId, step, wonGift, navigate]);

  // Load gifts from backend
  useEffect(() => {
    if (loading) return;
    const loadGifts = async () => {
      try {
        const res = await fetchGifts();
        setGifts(res.data);
        setCanSpin(true);          // enable spin button now
      } catch (err) {
        console.error('Failed to load gifts');
      }
    };
    if (gifts.length === 0) {
      loadGifts();
    } else {
      setCanSpin(true);
    }
  }, [loading, gifts.length, setGifts]);

  // Called when the user clicks the SPIN button
  const handleSpin = () => {
    if (!canSpin || spinning || mustSpin || gifts.length === 0) return;
    const randomIdx = Math.floor(Math.random() * gifts.length);
    setPrizeIndex(randomIdx);
    setMustSpin(true);
    setSpinning(true);
    setCanSpin(false);            // block further clicks
  };

  // Called by SpinWheel when the animation finishes
  const handleSpinComplete = useCallback(async () => {
    if (prizeIndex !== null && gifts[prizeIndex]) {
      const gift = gifts[prizeIndex];
      setWonGift(gift);
      setShowGiftPopup(true);
      // Save to backend (fire and forget)
      try {
        await saveSpinResult(gameId, gift._id);
        updateProgress(1, { wonGift: gift });
      } catch (err) {
        console.error('Failed to save spin result');
      }
    }
    setMustSpin(false);          // reset, so wheel doesn't spin again
    setSpinning(false);
  }, [prizeIndex, gifts, setWonGift, gameId, updateProgress]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!gameId) return null;

  return (
    <div className="spinpage">
      <h2>Spin to Win!</h2>
      {gifts.length > 0 ? (
        <>
          <SpinWheel
            data={gifts.map((g) => ({ option: g.name, image: g.image }))}
            mustSpin={mustSpin}
            prizeIndex={prizeIndex}
            onStopSpinning={handleSpinComplete}
          />
          {!mustSpin && !wonGift && (
            <button
              className="spin-btn"
              onClick={handleSpin}
              disabled={!canSpin || spinning}
            >
              {canSpin ? 'SPIN' : 'Loading...'}
            </button>
          )}
        </>
      ) : (
        <p>Loading wheel...</p>
      )}
      {showGiftPopup && wonGift && (
        <GiftPopup
          gift={wonGift}
          onClose={() => {
            setShowGiftPopup(false);
            navigate('/putinfo');
          }}
        />
      )}
    </div>
  );
};

export default SpinPage;