import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <h1>Welcome to Our Store</h1>
                <p>Browse through our amazing collection of musical instruments!</p>
                <Link to="/products" className="browse-button">Browse Products</Link>
            </div>
        );
    }
}
