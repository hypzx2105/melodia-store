import React, { Component } from "react";
import { PayPalButton } from "react-paypal-button-v2";


class Checkout extends Component {


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