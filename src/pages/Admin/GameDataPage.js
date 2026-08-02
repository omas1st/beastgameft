import React, { useState, useEffect } from 'react';
import { fetchAdminGifts, addGift, updateGift, deleteGift } from '../../services/api';
import './GameDataPage.css';

const GameDataPage = () => {
  const [gifts, setGifts] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGifts = async () => {
    try {
      const res = await fetchAdminGifts();
      setGifts(res.data);
    } catch (err) {
      console.error('Failed to load gifts');
    }
  };

  useEffect(() => {
    loadGifts();
  }, []);

  const handleSaveGift = async (e) => {
    e.preventDefault();
    if (!name.trim() || !image) return alert('Name and image required');

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('image', image);

    setLoading(true);
    try {
      await addGift(formData);
      setName('');
      setImage(null);
      await loadGifts();
      // Do not navigate away, just clear form
    } catch (err) {
      alert('Failed to save gift. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    // same as save but clears form and stays
    await handleSaveGift({ preventDefault: () => {} });
    // form is already cleared in handleSaveGift
  };

  const handleSaveAndDone = async () => {
    // save current gift and then maybe redirect? Keep on page, just done adding.
    await handleSaveGift({ preventDefault: () => {} });
    // could show a success message; no navigation needed per spec
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gift?')) return;
    try {
      await deleteGift(id);
      await loadGifts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (gift) => {
    setEditingId(gift._id);
    setEditName(gift.name);
    setEditImage(null);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return alert('Name required');
    const formData = new FormData();
    formData.append('name', editName.trim());
    if (editImage) formData.append('image', editImage);

    setLoading(true);
    try {
      await updateGift(editingId, formData);
      setEditingId(null);
      setEditName('');
      setEditImage(null);
      await loadGifts();
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-data-page">
      <h3>Gift Management</h3>

      {/* Add new gift form */}
      <div className="add-gift-section">
        <h4>Add New Gift</h4>
        <form onSubmit={handleSaveGift} className="add-gift-form">
          <input
            type="text"
            placeholder="Gift Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            disabled={loading}
          />
          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Gift'}
            </button>
            <button type="button" onClick={handleSaveAndAddAnother} disabled={loading}>
              Save & Add Another
            </button>
            <button type="button" onClick={handleSaveAndDone} disabled={loading}>
              Save & Done
            </button>
          </div>
        </form>
      </div>

      {/* Edit modal inline */}
      {editingId && (
        <div className="edit-modal">
          <h4>Edit Gift</h4>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Gift name"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditImage(e.target.files[0])}
          />
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Gift'}
          </button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      )}

      {/* Gifts list */}
      <div className="gifts-list">
        <h4>All Gifts</h4>
        {gifts.length === 0 ? (
          <p>No gifts added yet.</p>
        ) : (
          gifts.map((gift) => (
            <div key={gift._id} className="gift-item">
              <img src={gift.image} alt={gift.name} />
              <span className="gift-name">{gift.name}</span>
              <div className="gift-actions">
                <button onClick={() => handleEdit(gift)}>Edit</button>
                <button onClick={() => handleDelete(gift._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameDataPage;