import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import BookCard from "../components/BookCard";
import "./Home.css";
import {
  FiSearch,
  FiBookOpen,
  FiTrendingUp,
  FiFeather,
  FiHeart,
  FiStar,
  FiBook,
  FiList,
} from "react-icons/fi";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselImages = [
    "/images/carousel1.png", 
    "/images/carousel2.png", 
    "/images/carousel3.png",
    "/images/carousel3.png", 
  ];
  const bookGridRef = useRef(null);

  const fetchBooks = (searchTerm) => {
    axios
      .get(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then((res) => setBooks(res.data.docs.slice(0, 20)))
      .catch(() => console.error("Failed to fetch books"));
  };

  useEffect(() => {
    fetchBooks(category);
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const searchTerm = query.trim() !== "" ? query : category;
    fetchBooks(searchTerm);
    setTimeout(() => {
      bookGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // slight delay to ensure results are rendered
  };
  

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setQuery("");
    fetchBooks(cat);
  };

  const categories = [
    { key: "all", label: "All", icon: <FiList /> },
    { key: "best sellers", label: "Best Sellers", icon: <FiTrendingUp /> },
    { key: "fantasy", label: "Fantasy", icon: <FiFeather /> },
    { key: "history", label: "History", icon: <FiBook /> },
    { key: "art", label: "Art", icon: <FiStar /> },
    { key: "love stories", label: "Love Stories", icon: <FiHeart /> },
  ];

  return (
    <div className="home-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FiSearch className="icon" />
          Search
        </button>
      </div>

      {/* Carousel */}
      <div className="carousel">
      <div className={`carousel-item ${currentIndex === 0 ? "active center" : ""}`}>
  <img src={carouselImages[2]} alt="Slide 1" className="carousel-img" />
  <FiBookOpen className="carousel-icon" />
  <h1>We Love Literature</h1>
  <p>IT'S CHAPTERONE — We Love Literature...</p>
  <button className="btn1">READ MORE</button>
</div>
<div className={`carousel-item ${currentIndex === 1 ? "active right" : ""}`}>
  <img src={carouselImages[0]} alt="Slide 2" className="carousel-img" />
  <FiBookOpen className="carousel-icon" />
  <h1>Your World of Words</h1>
  <p>IT'S CHAPTERONE — Your world of words...</p>
  <button className="btn1">READ MORE</button>
</div>
<div className={`carousel-item ${currentIndex === 2 ? "active left" : ""}`}>
  <img src={carouselImages[1]} alt="Slide 3" className="carousel-img" />
  <FiBookOpen className="carousel-icon" />
  <h1>The All-Time Classics</h1>
  <p>IT'S CHAPTERONE — The all-time classics...</p>
  <button className="btn1">READ MORE</button>
</div>

        <div className="carousel-dots">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
            ></span>
          ))}
        </div>
      </div>

      {/* Category Buttons */}
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={category === cat.key ? "active" : ""}
            onClick={() => handleCategoryClick(cat.key)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="book-grid" ref={bookGridRef}>
        {books.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </div>
  );
}
