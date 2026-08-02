import React, { useState, useEffect } from 'react';
import { fetchGameIds, createGameId, deleteGameId, updateGameIdData } from '../../services/api';
import './DataPage.css';

const DataPage = () => {
  const [gameIds, setGameIds] = useState([]);
  const [newId, setNewId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadGameIds = async () => {
    const res = await fetchGameIds();
    setGameIds(res.data);
  };

  useEffect(() => { loadGameIds(); }, []);

  const handleCreate = async () => {
    if (!newId.trim()) return;
    await createGameId(newId.trim());
    setNewId('');
    loadGameIds();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this game ID permanently?')) {
      await deleteGameId(id);
      loadGameIds();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.gameId);
    setEditForm({
      gameId: item.gameId,
      name: item.userDetails?.name || '',
      email: item.userDetails?.email || '',
      phone: item.userDetails?.phone || '',
      country: item.userDetails?.country || '',
      address: item.userDetails?.address || '',
      deliveryId: item.deliveryId || '',
    });
  };

  const handleEditSave = async () => {
    await updateGameIdData(editingId, editForm);
    setEditingId(null);
    loadGameIds();
  };

  return (
    <div className="admin-data-page">
      <h3>Game IDs</h3>
      <div className="create-area">
        <input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="New Game ID" />
        <button onClick={handleCreate}>Create</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Game ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Address</th>
              <th>Prize Won</th>
              <th>Delivery ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gameIds.map(item => (
              <tr key={item._id}>
                {editingId === item.gameId ? (
                  // Edit mode: show inputs for user details / deliveryId. Prize Won is read-only.
                  <>
                    <td>
                      <input
                        value={editForm.gameId}
                        onChange={(e) => setEditForm({...editForm, gameId: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.country}
                        onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      />
                    </td>
                    <td>
                      {/* Prize Won is not editable – just show the name */}
                      {item.wonGift?.name || '—'}
                    </td>
                    <td>
                      <input
                        value={editForm.deliveryId}
                        onChange={(e) => setEditForm({...editForm, deliveryId: e.target.value})}
                      />
                    </td>
                    <td>
                      <button onClick={handleEditSave}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td>{item.gameId}</td>
                    <td>{item.userDetails?.name || '—'}</td>
                    <td>{item.userDetails?.email || '—'}</td>
                    <td>{item.userDetails?.phone || '—'}</td>
                    <td>{item.userDetails?.country || '—'}</td>
                    <td>{item.userDetails?.address || '—'}</td>
                    <td>{item.wonGift?.name || '—'}</td>
                    <td>{item.deliveryId || '—'}</td>
                    <td>
                      <button onClick={() => startEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item.gameId)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPage;