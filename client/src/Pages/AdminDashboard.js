import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../configClient/global_constants.js";
import { Navigate } from "react-router-dom";
import "../Styles/styles.scss";

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            users: [],
            redirect: false,
        };
    }

    componentDidMount() {
        const role = Number(sessionStorage.getItem("role"));
        if (role !== 2) {
            this.setState({ redirect: true });
            return;
        }

        axios.get(`${SERVER_HOST}/products`)
            .then(res => this.setState({ products: res.data }))
            .catch(err => console.error("Error fetching products:", err));

        axios.get(`${SERVER_HOST}/users`)
            .then(res => this.setState({ users: res.data }))
            .catch(err => console.error("Error fetching users:", err));
    }

    handleDeleteProduct = (productId) => {
        axios.delete(`${SERVER_HOST}/products/${productId}`)
            .then(() => {
                this.setState(prevState => ({
                    products: prevState.products.filter(product => product._id !== productId)
                }));
            })
            .catch(err => console.error("Error deleting product:", err));
    };

    handleDeleteUser = (userId) => {
        axios.delete(`${SERVER_HOST}/users/${userId}`)
            .then(() => {
                this.setState(prevState => ({
                    users: prevState.users.filter(user => user._id !== userId)
                }));
            })
            .catch(err => console.error("Error deleting user:", err));
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }

        return (
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>

                <h2>Manage Products</h2>
                {this.state.products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>
                                    <button onClick={() => this.handleDeleteProduct(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <h2>Manage Users</h2>
                {this.state.users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => this.handleDeleteUser(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}
