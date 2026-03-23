import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Server, Database } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Could not connect to Backend API. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const res = await axios.post(API_URL, { name });
      setItems([res.data, ...items]);
      setName('');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><Database size={32} /> MERN Docker Learning</h1>
        <p>A dummy project to practice your Docker skills!</p>
      </header>

      <main>
        <div className="card status-card">
          <div className="status-item">
            <Server size={20} />
            <span>Backend: <strong>{error ? 'Offline' : 'Online'}</strong></span>
          </div>
        </div>

        <form onSubmit={addItem} className="input-group">
          <input
            type="text"
            placeholder="Add new item (e.g. Dockerize Backend)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={!name}>
            <Plus size={20} /> Add
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="items-list">
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p className="empty-state">No items yet. Add one above!</p>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                <span>{item.name}</span>
                <button onClick={() => deleteItem(item._id)} className="delete-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <footer>
        <p>Built with React + Vite + Express + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
