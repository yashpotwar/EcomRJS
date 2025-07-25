import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css'; // We'll create this next
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const res = await axios.post(`http://192.168.29.71:5000/api/auth/user/${endpoint}`, form);

      if (res.data.success) {
        sessionStorage.setItem('user', JSON.stringify(res.data.user || form));
        navigate('/'); 
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? '🔐 Login' : '📝 Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="👤 Name"
            required
          />
        )}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="📧 Email"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="🔑 Password"
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p className="switch-text">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Login'}
        </span>
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AuthPage;
