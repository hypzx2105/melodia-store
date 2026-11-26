// Footer.js

import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="additional-links">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                </ul>
            </div>
            <div className="copyright">
                <hr/>
                <p>Copyright 2025 Melodia Store</p>
            </div>
        </footer>
    )
}

export default Footer
