import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://192.168.29.71:5000/api/categories', { Name: name });
      setMessage('✅ Category added!');
      setName('');
    } catch (err) {
      setMessage('❌ Error adding category');
    }
  };

  return (
    <div className="section-container">
      <h2>📁 Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category Name"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="logout">Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCategory;