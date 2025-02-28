import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

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
            buttonType: "error-button",
            heading: "",
            message: "",
            messageClass: ""
        };
    }

    componentDidMount() {
        const { messageType, payPalPaymentID } = this.props.match.params;

        if (messageType === PayPalMessage.messageType.SUCCESS) {
            this.setState({
                heading: "PayPal Transaction Confirmation",
                message: `Your PayPal transaction was successful!`,
                buttonType: "success-button",
                messageClass: "success-message",
                payPalPaymentID
            });
        } else if (messageType === PayPalMessage.messageType.CANCEL) {
            this.setState({
                heading: "PayPal Transaction Cancelled",
                message: "You cancelled your PayPal transaction. The transaction was not completed.",
                messageClass: "error-message"
            });
        } else if (messageType === PayPalMessage.messageType.ERROR) {
            this.setState({
                heading: "PayPal Transaction Error",
                message: "An error occurred during your PayPal transaction. Please try again.",
                messageClass: "error-message"
            });
        } else {
            console.error("Invalid messageType provided.");
        }
    }

    render() {
        return (
            <div className={`payPalMessage ${this.state.messageClass}`}>
                {this.state.redirectToProductPage && <Redirect to="/ProductPage" />}

                <h3>{this.state.heading}</h3>
                <p>{this.state.message}</p>

                {this.state.payPalPaymentID && (
                    <p>Your PayPal payment confirmation is <span id="payPalPaymentID">{this.state.payPalPaymentID}</span></p>
                )}

                <p id="payPalPaymentIDButton">
                    <Link className={this.state.buttonType} to="/ProductPage">Continue</Link>
                </p>
            </div>
        );
    }
}
