import React from "react";
import { Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ book }) {
  // Construct the cover image URL or use a placeholder
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/100x150?text=No+Cover";

  return (
    <div className="book-card">
      <img
        src={coverUrl}
        alt={book.title}
        className="book-cover"
      />
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author_name?.[0] || "Unknown"}</p>
      <p><strong>Price:</strong> Rs. {(Math.random() * 1000).toFixed(2)}</p>
      <Link to={`/book/${book.key.split("/").pop()}`}>View Details</Link>
    </div>
  );
}
