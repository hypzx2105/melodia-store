import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchProducts from './SearchProducts';
import { SERVER_HOST, imageUrl } from '../configClient/global_constants';
import '../Styles/products.scss';

class ProductPage extends Component {
    state = {
        products: [],
        sortBy: 'price',
        minRating: 0,
        searchText: '',
        addedId: null,
        loading: true,
        loadError: false,
    };

    componentDidMount() {
        axios.get(`${SERVER_HOST}/products`)
            .then((res) => this.setState({ products: res.data, loading: false }))
            .catch((err) => {
                console.error('Error fetching products:', err);
                this.setState({ loading: false, loadError: true });
            });
    }

    handleSortChange = (event) => {
        this.setState({ sortBy: event.target.value });
    };

    handleFilterChange = (event) => {
        this.setState({ minRating: Number(event.target.value) });
    };

    handleSearch = (text) => {
        this.setState({ searchText: text.toLowerCase() });
    };

    handleAddToCart = (product) => {
        this.props.addToCart(product);
        this.setState({ addedId: product._id });
        setTimeout(() => this.setState({ addedId: null }), 1200);
    };

    getFilteredProducts = () => {
        const { products, minRating, searchText, sortBy } = this.state;

        return products
            .filter((product) => product.rating >= minRating)
            .filter((product) => product.name.toLowerCase().includes(searchText))
            .sort((a, b) => {
                if (sortBy === 'price') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                return b.rating - a.rating;
            });
    };

    render() {
        const filteredProducts = this.getFilteredProducts();

        return (
            <div className="products-page">
                <h1>Our Products</h1>

                <div className="filters">
                    <SearchProducts onSearch={this.handleSearch}/>

                    <label>
                        Sort by:
                        <select onChange={this.handleSortChange}>
                            <option value="price">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
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

                {this.state.loading && <p className="no-results">Loading products...</p>}
                {this.state.loadError && (
                    <p className="no-results">We couldn't load the products right now. Please try again in a moment.</p>
                )}
                {!this.state.loading && !this.state.loadError && this.state.products.length === 0 && (
                    <p className="no-results">There are no products in the shop yet.</p>
                )}
                {this.state.products.length > 0 && filteredProducts.length === 0 && (
                    <p className="no-results">No products match your search.</p>
                )}

                <div className="product-list">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <Link to={`/product/${product._id}`}>
                                <img src={imageUrl(product.image)} alt={product.name} className="product-image"/>
                            </Link>
                            <Link to={`/product/${product._id}`} className="product-link">
                                <h2>{product.name}</h2>
                            </Link>
                            <p className="price">${product.price}</p>
                            <div className="rating">⭐ {product.rating} / 5</div>
                            <p>{product.description}</p>
                            <button onClick={() => this.handleAddToCart(product)}>
                                {this.state.addedId === product._id ? 'Added!' : 'Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ProductPage;
