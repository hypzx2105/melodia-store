import React, { Component } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Navigate } from "react-router-dom"; // Add this import

class Checkout extends Component {
    // ... rest of the component

    render() {
        if (this.state.paymentCompleted) {
            return <Navigate to="/products" />;
        }

        return (
            // ... rest of the component
            <PayPalButton
                onSuccess={(details, data) => {
                    this.props.clearCart();
                    return <Navigate to={`/paypal-message/success/${data.orderID}`} replace />;
                }}
                onCancel={() => {
                    return <Navigate to="/paypal-message/cancel" replace />;
                }}
                onError={() => {
                    return <Navigate to="/paypal-message/error" replace />;
                }}
            />
        );
    }
}