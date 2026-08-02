import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../../services/api';
import './DeliveryLinksPage.css';

const DeliveryLinksPage = () => {
  const [links, setLinks] = useState({ deliveryLink1: '', deliveryLink2: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSettings();
        setLinks({
          deliveryLink1: res.data.deliveryLink1 || '',
          deliveryLink2: res.data.deliveryLink2 || '',
        });
      } catch (err) {
        console.error('Failed to load settings');
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(links);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Failed to save links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-links-page">
      <h3>Delivery Links</h3>
      <form onSubmit={handleSubmit} className="links-form">
        <label>
          Delivery 1 Link:
          <input
            type="url"
            name="deliveryLink1"
            value={links.deliveryLink1}
            onChange={handleChange}
            placeholder="https://t.me/fedexlogisticzdelivery"
            required
          />
        </label>
        <label>
          Delivery 2 Link:
          <input
            type="url"
            name="deliveryLink2"
            value={links.deliveryLink2}
            onChange={handleChange}
            placeholder="https://t.me/DHLlogisticzdelivery"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Links'}
        </button>
        {saved && <span className="saved-msg">Saved!</span>}
      </form>
    </div>
  );
};

export default DeliveryLinksPage;