import React, { useState } from 'react';
import axios from 'axios';

const AdminBannerUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a banner image first.');

    const formData = new FormData();
    formData.append('banner', file);

    try {
      const res = await axios.post('http://localhost:5000/api/banners/upload', formData);
      setMessage('✅ Banner uploaded successfully!');
      setPreview(`http://localhost:5000${res.data.imageUrl}`);
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Upload Home Banner</h2>

      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && <img src={preview} alt="Preview" className="mt-4 h-40 object-contain" />}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleUpload}
      >
        Upload Banner
      </button>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default AdminBannerUpload;
