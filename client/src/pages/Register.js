import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    bio: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful!");
      setForm({
        username: "",
        email: "",
        password: "",
        age: "",
        bio: ""
      });
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age (optional)"
          value={form.age}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Short bio (optional)"
          value={form.bio}
          onChange={handleChange}
          rows="3"
        ></textarea><br></br>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
