import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SANDBOX_CLIENT_ID, SERVER_HOST, imageUrl, authHeader } from "../configClient/global_constants";
import "../Styles/cart.scss";

class CartPage extends Component {
    state = {
        showPayPal: false,
        orderID: "",
    };

    handleCheckout = () => {
        if (this.props.token && this.props.cart.length > 0) {
            this.setState({ showPayPal: true });
        }
    };

    handleCreateOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: this.calculateTotal(),
                },
            }],
        }).then(orderID => {
            this.setState({ orderID });
            return orderID;
        });
    };

    handleApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            const items = this.props.cart.map(item => ({ _id: item._id, quantity: item.quantity }));

            return axios.post(`${SERVER_HOST}/orders`, { items, payPalPaymentID: details.id }, authHeader())
                .catch(err => console.error("Order was paid but could not be saved:", err))
                .then(() => {
                    this.props.clearCart();
                    window.location.href = `/paypalmessage/success/${details.id}`;
                });
        });
    };

    handleError = (err) => {
        console.error("PayPal Checkout Error:", err);
        window.location.href = "/paypalmessage/error";
    };

    calculateTotal = () => {
        return this.props.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    render() {
        const { cart } = this.props;

        return (
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                {cart.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty. <Link to="/products">Browse products</Link></p>
                ) : (
                    <>
                        <ul>
                            {cart.map((item) => (
                                <li key={item._id} className="cart-item">
                                    <img src={imageUrl(item.image)} alt={item.name} className="cart-item-image"/>
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>${item.price}</p>
                                        <div className="quantity-section">
                                            <span className="quantity">Quantity: {item.quantity}</span>
                                            <div className="quantity-controls">
                                                <button
                                                    className="quantity-btn decrease"
                                                    onClick={() => this.props.updateQuantity(item._id, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <button
                                                    className="quantity-btn increase"
                                                    onClick={() => this.props.updateQuantity(item._id, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => this.props.removeFromCart(item._id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="checkout-section">
                            <h3>Total: ${this.calculateTotal()}</h3>
                            {!this.state.showPayPal && (this.props.token ? (
                                <button className="checkout-btn" onClick={this.handleCheckout}>
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <Link to="/login" className="checkout-btn">Log in to checkout</Link>
                            ))}

                            {/* PayPal Button Section */}
                            {this.state.showPayPal && (
                                <PayPalScriptProvider options={{ clientId: SANDBOX_CLIENT_ID, currency: "USD" }}>
                                    <PayPalButtons
                                        createOrder={this.handleCreateOrder}
                                        onApprove={this.handleApprove}
                                        onCancel={() => (window.location.href = "/paypalmessage/cancel")}
                                        onError={this.handleError}
                                    />
                                </PayPalScriptProvider>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default CartPage;
