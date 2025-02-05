import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/products.scss';
import searchProducts from "./searchProducts";
class ProductPage extends Component {
    state = {
        products: [],
        sortBy: 'price',
        minRating: 0,
        searchQuery: '',
    };

    componentDidMount() {
        fetch('http://localhost:4000/products')
            .then((res) => res.json())
            .then((data) => this.setState({ products: data, originalProducts: data }))
            .catch((err) => console.error('Error fetching products:', err));
    }

    handleSortChange = (event) => {
        this.setState({ sortBy: event.target.value });
    };

    handleFilterChange = (event) => {
        this.setState({ minRating: Number(event.target.value) });
    };

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    getFilteredProducts = () => {
        const { products, sortBy, minRating, searchQuery } = this.state;
        return products.filter((product) => product.rating >= minRating)
            .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.color.toLowerCase().includes(searchQuery.toLowerCase())

            )
            .sort((a, b) => (sortBy === 'price' ? a.price - b.price : b.rating - a.rating));
    };

    render() {
        const filteredProducts = this.getFilteredProducts();

        return (
            <div className="body">
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

                    <label>
                        Search:
                        <input type="text" placeholder="Search products" onChange={this.handleSearch}/>
                    </label>
                </div>

                <div className="product-list">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
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