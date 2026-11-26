import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/main_pageCSS.scss";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { SERVER_HOST } from "../configClient/global_constants";

import electricGuitarImage from "../Images/electric-guitar-banner.jpg";
import violinImage from "../Images/violin-banner.jpg";
import fluteImage from "../Images/flute-banner.jpg";
import pianoImage from "../Images/keyboard-banner.jpg";
import drumsImage from "../Images/snare-drum-banner.jpg";
import saxophoneImage from "../Images/saxophone-banner.jpg";

const MainPage = () => {
    const [slides, setSlides] = useState([
        {
            id: 1,
            name: "Electric Guitar",
            image: electricGuitarImage,
            description: "A versatile instrument perfect for rock, jazz, and blues. Known for its powerful sound and sleek design.",
        },
        {
            id: 2,
            name: "Violin",
            image: violinImage,
            description: "A classical string instrument with a rich, expressive tone. Ideal for orchestral and solo performances.",
        },
        {
            id: 3,
            name: "Flute",
            image: fluteImage,
            description: "A woodwind instrument that produces a soft, melodic sound. Great for classical and contemporary music.",
        },
        {
            id: 4,
            name: "Digital Piano",
            image: pianoImage,
            description: "A timeless instrument with a wide range of notes. Perfect for composing, performing, and practicing.",
        },
        {
            id: 5,
            name: "Snare Drum",
            image: drumsImage,
            description: "The heartbeat of any band. Provides rhythm and energy to all genres of music.",
        },
        {
            id: 6,
            name: "Alto Saxophone",
            image: saxophoneImage,
            description: "A smooth and soulful wind instrument. Popular in jazz, blues, and pop music.",
        },
    ]);

    const [productIds, setProductIds] = useState({});

    const handleNext = () => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            const firstSlide = newSlides.shift();
            newSlides.push(firstSlide);
            return newSlides;
        });
    };

    const handlePrev = () => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            const lastSlide = newSlides.pop();
            newSlides.unshift(lastSlide);
            return newSlides;
        });
    };

    useEffect(() => {
        axios.get(`${SERVER_HOST}/products`)
            .then((res) => {
                const ids = {};
                res.data.forEach((product) => (ids[product.name] = product._id));
                setProductIds(ids);
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="main-page">
            <div className="welcome">
                <h1>Welcome to Melodia Store</h1>
                <p>Browse through our amazing collection of musical instruments!</p>
                <Link to="/products" className="browse-button">Browse Products</Link>
            </div>

            <div className="container">
                <div className="slide">
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="item"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="content">
                                <div className="name">{slide.name}</div>
                                <div className="des">{slide.description}</div>
                                <Link to={productIds[slide.name] ? `/product/${productIds[slide.name]}` : "/products"}>
                                    <button>See More</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button">
                    <button className="prev" onClick={handlePrev}>
                        <FaArrowLeft/>
                    </button>
                    <button className="next" onClick={handleNext}>
                        <FaArrowRight/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;