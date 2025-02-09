import React, { Component } from 'react';
import '../Styles/cart.scss';

class CartPage extends Component {
    handleRemoveFromCart = (productId) => {
        this.props.removeFromCart(productId);
    };



    render() {
        const { cart } = this.props;

        return (
            <div className="cart-page">
                <h1>Shopping Cart</h1>
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <ul>
                        {cart.map((product) => (
                            <li key={product._id} className="cart-item">
                                <img src={product.image} alt={product.name} className="cart-image" />
                                <div>
                                    <h3>{product.name}</h3>
                                    <p>${product.price}</p>
                                    <button className="remove-btn" onClick={() => this.handleRemoveFromCart(product._id)}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default CartPage;






