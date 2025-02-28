import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/products.scss';
import '../Styles/styles.scss';
import SearchProducts from './SearchProducts';

class ProductPage extends Component {
    state = {
        products: [],
        filteredProducts: [],
        sortBy: 'price',
        minRating: 0,
        searchQuery: '',
    };

    componentDidMount() {
        fetch('http://localhost:4000/products')
            .then((res) => res.json())
            .then((data) => this.setState({ products: data, filteredProducts: data }))
            .catch((err) => console.error('Error fetching products:', err));
    }

    render() {
        const { filteredProducts } = this.state;

        return (
            <div className="form-container">
                <SearchProducts onSearch={this.handleSearch} />

                <div className="filters">
                    {/* Existing filter controls */}
                </div>

                <div className="product-list">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <Link to={`/product/${product._id}`} className="product-link">
                                <h2>{product.name}</h2>
                            </Link>
                            <button
                                onClick={() => this.props.addToCart(product)}
                                disabled={this.props.cart.some(item => item._id === product._id)}
                            >
                                {this.props.cart.some(item => item._id === product._id)
                                    ? "Added to Cart"
                                    : "Add to Cart"}
                            </button>
                            {/* Rest of product card */}
                        </div>
                    ))}
                </div>
            </div>
        );
    }


}

export default ProductPage;