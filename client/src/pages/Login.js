import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState(""); // Not email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: username,
        password: password,
      });

      console.log("Login response:", res.data);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
         localStorage.setItem('userInfo', JSON.stringify(res.data.user));
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
    <div>
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
  );
};

export default Login;
