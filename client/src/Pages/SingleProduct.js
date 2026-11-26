import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST, imageUrl } from "../configClient/global_constants";
import "../Styles/products.scss";

const SingleProduct = ({ addToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        axios.get(`${SERVER_HOST}/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.errorMessage || "Product not found");
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
    };

    if (loading) return <div className="product-details-page">Loading product...</div>;
    if (error) return <div className="product-details-page">{error}</div>;

    return (
        <div className="product-details-page">
            <Link to="/products" className="back-link">Back to products</Link>
            <div className="product-details">
                <img src={imageUrl(product.image)} alt={product.name}/>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <div className="rating">⭐ {product.rating} / 5</div>
                    <p className="price">${product.price}</p>
                    <p>{product.description}</p>
                    {product.color && <p><strong>Colour:</strong> {product.color}</p>}
                    <h3>Features:</h3>
                    {product.features && product.features.length > 0 ? (
                        <ul>
                            {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No features listed.</p>
                    )}
                    <button onClick={handleAddToCart}>{added ? "Added to cart" : "Add to Cart"}</button>
                    {added && <Link to="/cart" className="go-to-cart">Go to cart</Link>}
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
