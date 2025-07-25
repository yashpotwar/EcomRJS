import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Not email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://192.168.29.71:5000/api/auth/login", {
        identifier: username,
        password: password,
      });

      console.log("Login response:", res.data);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
localStorage.setItem('userInfo', JSON.stringify(res.data.user));

       // sessionStorage.setItem('userInfo', JSON.stringify(res.data.user));
        navigate('/admin/dashboard');

      } else {
        alert("❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Login error", err);
      alert("❌ Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;