import React, { useState, useEffect } from "react";
import "./Header.css";

const images = [
  "/header_img3.jpg",
  "/header_img1.jpg",
  "/header_img.jpeg",
  "/header_img2.jpg",
  "/header_img7.jpg",
  "/header_img5.jpg",
  "/header_img6.jpg",

  // Add more image paths as needed
];

const Header = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div
      className="header"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div className="header-contents">
        <h2>Order your favorite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients to satisfy your cravings and
          elevate your dining experience, one delicious meal at a time.
        </p>
        <a href="#explore-menu">
          <button className="buttonwl">View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
