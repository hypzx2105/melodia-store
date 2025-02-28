import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/main_pageCSS.scss";

import electricGuitarImage from "../Images/electric guitar.jpeg";
import violinImage from "../Images/violen.png";
import fluteImage from "../Images/flute.jpeg";
import pianoImage from "../Images/saxaphone.jpeg";
import drumsImage from "../Images/drums.jpeg";
import saxophoneImage from "../Images/saxaphone.jpeg";

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
            name: "Piano",
            image: pianoImage,
            description: "A timeless instrument with a wide range of notes. Perfect for composing, performing, and practicing.",
        },
        {
            id: 5,
            name: "Drums",
            image: drumsImage,
            description: "The heartbeat of any band. Provides rhythm and energy to all genres of music.",
        },
        {
            id: 6,
            name: "Saxophone",
            image: saxophoneImage,
            description: "A smooth and soulful wind instrument. Popular in jazz, blues, and pop music.",
        },
    ]);

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
                                <Link to={`/product/${slide.id}`}>
                                    <button>See More</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button">
                    <button className="prev" onClick={handlePrev}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button className="next" onClick={handleNext}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;