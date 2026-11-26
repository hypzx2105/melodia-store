import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Pages/menu";
import Footer from "./Pages/footer";
import MainPage from "./Pages/MainPage";
import ProductPage from "./Pages/ProductPage";
import SingleProduct from "./Pages/SingleProduct";
import CartPage from "./Pages/CartPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import AdminDashboard from "./Pages/AdminDashboard";
import { WithParams as PayPalMessage } from "./Pages/PayPalMessage";
import "./Styles/styles.scss";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: JSON.parse(localStorage.getItem("cart")) || [],
            token: localStorage.getItem("token"),
            role: localStorage.getItem("role"),
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email")
        };
    }

    saveCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
        this.setState({ cart });
    };

    addToCart = (product) => {
        const inCart = this.state.cart.find(item => item._id === product._id);
        if (inCart) {
            this.updateQuantity(product._id, 1);
        } else {
            this.saveCart([...this.state.cart, { ...product, quantity: 1 }]);
        }
    };

    updateQuantity = (productId, change) => {
        this.saveCart(this.state.cart.map(item =>
            item._id === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };

    removeFromCart = (productId) => {
        this.saveCart(this.state.cart.filter(item => item._id !== productId));
    };

    clearCart = () => {
        this.saveCart([]);
    };

    updateUserState = () => {
        this.setState({
            token: localStorage.getItem("token"),
            role: localStorage.getItem("role"),
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email")
        });
    };

    logout = () => {
        ["token", "userId", "role", "name", "email", "profilePic"].forEach(key => localStorage.removeItem(key));
        this.updateUserState();
    };

    render() {
        const { cart, token, role, name, email } = this.state;

        return (
            <div className="app">
                <Menu cart={cart} role={role} token={token} name={name} logout={this.logout}/>

                <main>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/products" element={<ProductPage addToCart={this.addToCart}/>}/>
                        <Route path="/product/:id" element={<SingleProduct addToCart={this.addToCart}/>}/>
                        <Route path="/cart" element={
                            <CartPage
                                cart={cart}
                                token={token}
                                updateQuantity={this.updateQuantity}
                                removeFromCart={this.removeFromCart}
                                clearCart={this.clearCart}
                            />
                        }/>
                        <Route path="/login" element={<LoginPage updateUserState={this.updateUserState}/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/profile" element={
                            token ? <ProfilePage user={{ name, email }}/> : <Navigate to="/login"/>
                        }/>
                        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                        <Route path="/paypalmessage/:messageType" element={<PayPalMessage/>}/>
                        <Route path="/paypalmessage/:messageType/:payPalPaymentID" element={<PayPalMessage/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </main>

                <Footer/>
            </div>
        );
    }
}
