import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching product with ID:", id);
        fetch(`http://localhost:4000/products/${id}`)
            .then((res) => {
                console.log("Response status:", res.status);
                console.log("Response headers:", res.headers);
                if (!res.ok) {
                    throw new Error("Product not found");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Product data:", data);
                if (!data || Object.keys(data).length === 0) {
                    throw new Error("Product data is empty");
                }
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product:", err); // Debug: Log the error
                setError(err.message || "An unexpected error occurred");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading product...</div>;
    if (error) return <div>{error}</div>;
    if (!product || Object.keys(product).length === 0) return <div>Product not found</div>;

    return (
        <div className="product-details-page">
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
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
        </div>
    );
};

export default SingleProduct;