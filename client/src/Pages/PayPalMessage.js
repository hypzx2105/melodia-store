import React, { Component } from "react";
import { Navigate, Link, useParams } from "react-router-dom";

export default class PayPalMessage extends Component {
    static messageType = {
        SUCCESS: "success",
        ERROR: "error",
        CANCEL: "cancel"
    };

    constructor(props) {
        super(props);
        this.state = {
            redirectToProductPage: false,
            heading: "",
            message: "",
            messageClass: ""
        };
    }

    componentDidMount() {
        const params = this.props.params || {};
        let messageClass = "error-message";

        if (params.messageType === PayPalMessage.messageType.SUCCESS) {
            this.setState({
                heading: "PayPal Transaction Confirmation",
                message: `Your PayPal transaction was successful. Transaction ID: ${params.payPalPaymentID || "N/A"}`,
                messageClass: "success-message"
            });
        } else if (params.messageType === PayPalMessage.messageType.CANCEL) {
            this.setState({
                heading: "PayPal Transaction Cancelled",
                message: "You cancelled your PayPal transaction.",
                messageClass: messageClass
            });
        } else {
            this.setState({
                heading: "PayPal Transaction Error",
                message: "An error occurred during the transaction.",
                messageClass: messageClass
            });
        }
    }

    render() {
        return (
            <div className={`payPalMessage ${this.state.messageClass}`}>
                {this.state.redirectToProductPage && <Navigate to="/products" replace />}
                <h3>{this.state.heading}</h3>
                <p>{this.state.message}</p>
                <Link className="continue-button" to="/products">Continue Shopping</Link>
            </div>
        );
    }
}

export function WithParams(props) {
    const params = useParams();
    return <PayPalMessage {...props} params={params} />;
}
