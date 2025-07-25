import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
  axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("isAdminLoggedIn");
      navigate('/');
    })
    .catch(err => {
      console.error('Logout error:', err);
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("isAdminLoggedIn");
    });
}, [navigate]);
  return <p>Logging out...</p>;
};

export default Logout;
