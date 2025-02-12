import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/products.scss';


class ProductPage extends Component {
    state = {
        products: [],
        sortBy: 'price',
        minRating: 0,
    };

    componentDidMount() {
        fetch('http://localhost:4000/products')
            .then((res) => res.json())
            .then((data) => this.setState({ products: data }))
            .catch((err) => console.error('Error fetching products:', err));
    }

    handleSortChange = (event) => {
        this.setState({ sortBy: event.target.value });
    };

    handleFilterChange = (event) => {
        this.setState({ minRating: Number(event.target.value) });
    };

    getFilteredProducts = () => {
        return this.state.products
            .filter((product) => product.rating >= this.state.minRating)
            .sort((a, b) => (this.state.sortBy === 'price' ? a.price - b.price : b.rating - a.rating));
    };

    render() {
        const filteredProducts = this.getFilteredProducts();

        return (
            <div>
                <h1>Our Products</h1>

                <div className="filters">
                    <label>
                        Sort by:
                        <select onChange={this.handleSortChange}>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                        </select>
                    </label>

                    <label>
                        Min Rating:
                        <select onChange={this.handleFilterChange}>
                            <option value="0">All</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </label>
                </div>

                <div className="product-list">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image"/>
                            <Link to={`/product/${product._id}`} className="product-link">
                                <h2>{product.name}</h2>
                            </Link>
                            <p className="price">${product.price}</p>
                            <div className="rating">⭐ {product.rating} / 5</div>
                            <p>{product.description}</p>
                            <button onClick={() => this.props.addToCart(product)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ProductPage;











