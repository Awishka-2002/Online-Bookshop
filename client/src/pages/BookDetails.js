import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [coverId, setCoverId] = useState(null);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`https://openlibrary.org/works/${id}.json`)
      .then((res) => {
        setBook(res.data);
        setPrice((Math.random() * 1000).toFixed(2)); // Random price for demo

        if (res.data.covers && res.data.covers.length > 0) {
          setCoverId(res.data.covers[0]);
        } else {
          axios
            .get(`https://openlibrary.org/works/${id}/editions.json?limit=1`)
            .then((editionRes) => {
              const edition = editionRes.data.entries[0];
              if (edition?.covers?.length > 0) {
                setCoverId(edition.covers[0]);
              }
            })
            .catch((err) => console.error("Failed to load edition cover", err));
        }
      })
      .catch((err) => console.error("Failed to load book details", err));
  }, [id]);

  if (!book) return <p>Loading......</p>;

  const coverImageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : "https://via.placeholder.com/200x300?text=No+Cover";

  const description =
    typeof book.description === "string"
      ? book.description
      : book.description?.value || "No description available.";

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const bookItem = {
      id,
      title: book.title,
      price,
      coverImageUrl,
      quantity: 1
    };
    cart.push(bookItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Book added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart"); // Redirects to Cart page after adding
  };

  return (
    <div className="book-details">
      <div className="book-cover">
        <img src={coverImageUrl} alt={book.title} />
      </div>
      <div className="book-info">
        <h2>{book.title}</h2>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Price:</strong> Rs. {price}</p>
        <p><strong>Stock:</strong> In stock</p>

        <div className="button-group">
          <button className="btn-add" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn-buy" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
