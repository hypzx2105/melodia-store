import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/products.scss';

class SingleProductPage extends Component {
    state = { product: null };

    componentDidMount() {
        const { productId } = this.props;
        fetch(`http://localhost:4000/products/${productId}`)
            .then((res) => res.json())
            .then((data) => this.setState({ product: data }))
            .catch((err) => console.error('Error fetching product:', err));
    }

    render() {
        const { product } = this.state;
        if (!product) return <p>Loading product...</p>;

        return (
            <div className="single-product">
                <img src={product.image} alt={product.name} className="product-image" />
                <h1>{product.name}</h1>
                <p className="price">${product.price}</p>
                <p>{product.description}</p>
                <div className="rating">⭐ {product.rating} / 5</div>
                <button onClick={() => this.props.addToCart(product)}>Add to Cart</button>
            </div>
        );
    }
}

export default function Wrapper(props) {
    const { productId } = useParams();
    return <SingleProductPage {...props} productId={productId} />;
}

