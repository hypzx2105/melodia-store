import React, { Component } from "react";
import "../Styles/cart.scss";

class CartPage extends Component {
    render() {
        return (
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                {this.props.cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {this.props.cart.map((item) => (
                            <li key={item._id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div>
                                    <h3>{item.name}</h3>
                                    <p>${item.price}</p>
                                    <p>Quantity: {item.quantity}</p> {/* Show quantity */}
                                </div>
                                <button className="remove-btn" onClick={() => this.props.removeFromCart(item._id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default CartPage;
