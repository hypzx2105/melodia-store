import React from "react";
import { Link } from "react-router-dom";
import "../Styles/menu.scss";

const Menu = ({ cart, role, token, name, logout }) => {
    const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="logo">Melodia</Link>
                <Link to="/" className="mainbut">Main</Link>
                <Link to="/products" className="productbut">Browse Products</Link>
                <Link to="/cart" className="cartbut">Cart ({itemsInCart})</Link>
                {role === "2" && <Link to="/admin-dashboard">Admin Dashboard</Link>}
            </div>
            <div className="nav-right">
                {token ? (
                    <div className="user-info">
                        <Link to="/profile" className="profilebutt">{name}</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Menu;
