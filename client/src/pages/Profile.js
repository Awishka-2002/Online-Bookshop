import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ username: "", age: "", bio: "" });
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User not logged in.");
      return;
    }
  
    // Fetch profile
     axios.get("http://localhost:5000/api/auth/profile",  {
      headers: { Authorization: `Bearer ${token}` },

      })
      .then((res) => {
        setUser(res.data);
        setForm({
          username: res.data.username,
          age: res.data.age,
          bio: res.data.bio,
        });
      })
      .catch((err) => {
        setError("Failed to load profile.");
        console.error(err);
      });
  
    // Fetch order history
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },

      })
      .then((res) => {
        console.log("Order History:", res.data); // Log the response
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Failed to load orders", err);
      });
  }, [token]);
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("age", form.age);
    formData.append("bio", form.bio);
    if (file) formData.append("profileImage", file);

    try {
      const res = await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setEdit(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  if (error) return <div className="profile-container"><p className="error">{error}</p></div>;
  if (!user) return <div className="profile-container"><p>Loading...</p></div>;

  return (
    <div className="profile-container">
      <h2>{user.username}</h2>

      {user.profileImage && (
        <img
          src={`http://localhost:5000/uploads/${user.profileImage}`}
          alt="Profile"
          className="profile-pic"
        />
      )}

      {!edit ? (
        <>
          <div className="profile-card">
  <div className="profile-row">
    <p><strong>Username:</strong> {user.username}</p>
    <p><strong>Email:</strong> {user.email}</p>
  </div>
  <div className="profile-row">
    <p><strong>Age:</strong> {user.age || "Not specified"}</p>
    <p><strong>Bio:</strong> {user.bio || "No bio available."}</p>
  </div>
</div>

          <button className="btn" onClick={() => setEdit(true)}>Edit Profile</button>

          <h3>Order History</h3>

{orders.length === 0 ? (
  <p>No orders found.</p>
) : (
  <ul className="order-list">
    {orders.map((order) => (
      <li key={order._id} className="order-item">
        
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        
        <p><strong>Total:</strong> Rs.{order.total}</p>
        

        <div className="order-items">
          <p><strong>Book Name & Quantity:</strong></p>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>
                {item.bookTitle} - {item.quantity} pcs
              </li>
            ))}
          </ul>
        </div>
      </li>
    ))}
  </ul>
)}


        </>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Age"
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Bio"
          ></textarea>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" className="btn">Save</button>
          <button type="button" className="btn cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
