import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Checkout from "./Checkout";
import {
    ACCESS_LEVEL_GUEST,
    ACCESS_LEVEL_ADMIN,
    SERVER_HOST,
    ACCESS_LEVEL_NORMAL_USER,
} from "../configClient/global_constants";

export default class BuyInstruments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instruments: [],
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            SearchProducts: [],
            originalInstruments: [],
            filters: { brand: [], color: [] },
            searchQuery: "",
            sortOption: "",
            showCheckout: false
        };
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/instruments`)
            .then((res) => {
                this.setState({
                    originalInstruments: res.data,
                    searchedInstruments: res.data,
                    instruments: res.data,
                });
            })
            .catch((error) => console.log(error));
    }

    addToCart = (product) => {
        this.setState(prevState => {
            const newCart = [...prevState.cart, product];
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { cart: newCart };
        });
    };

    removeFromCart = (productId) => {
        this.setState(prevState => {
            const newCart = prevState.cart.filter(item => item._id !== productId);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { cart: newCart };
        });
    };

    clearCart = () => {
        localStorage.removeItem('cart');
        this.setState({ cart: [], showCheckout: false });
    };

    render() {
        return (
            <div className="form-container">
                {/* Existing header/nav code */}

                {this.state.showCheckout ? (
                    <Checkout
                        cart={this.state.cart}
                        clearCart={this.clearCart}
                        history={this.props.history}
                    />
                ) : (
                    <>
                        <SearchInstruments onSearch={this.handleSearch} />
                        <SortInstruments onSortChange={this.handleSortChange} />
                        <FilterInstruments onFilterChange={this.handleFilterChange} />

                        <div className="table-container">
                            <InstrumentTable
                                instruments={this.state.instruments}
                                cart={this.state.cart}
                                addToCart={this.addToCart}
                            />

                            {this.state.cart.length > 0 && (
                                <button
                                    className="checkout-button"
                                    onClick={() => this.setState({ showCheckout: true })}
                                >
                                    Proceed to Checkout ({this.state.cart.length})
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Existing filter/sort methods
}