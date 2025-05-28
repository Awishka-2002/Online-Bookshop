import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // Update the endpoint here to match the backend
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const token = res.data.token;
      const user = res.data.user;
  
      if (remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }
  
      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid password.");
      } else if (err.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Login failed. Try again.");
      }
    }
  };
  return (
    <div className="auth-page">
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email or Username"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}
