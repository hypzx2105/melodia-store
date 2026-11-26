import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST, imageUrl, authHeader } from "../configClient/global_constants.js";
import { Navigate } from "react-router-dom";
import "../Styles/styles.scss";

const emptyProduct = { name: "", price: "", description: "", color: "", rating: "", features: "" };

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            users: [],
            redirect: false,
            newProduct: { ...emptyProduct },
            newImage: null,
            errorMessage: "",
        };
    }

    componentDidMount() {
        const role = Number(localStorage.getItem("role"));
        if (role !== 2) {
            this.setState({ redirect: true });
            return;
        }

        axios.get(`${SERVER_HOST}/products`)
            .then(res => this.setState({ products: res.data }))
            .catch(err => console.error("Error fetching products:", err));

        axios.get(`${SERVER_HOST}/users`, authHeader())
            .then(res => this.setState({ users: res.data }))
            .catch(err => console.error("Error fetching users:", err));
    }

    handleProductChange = (event) => {
        this.setState({ newProduct: { ...this.state.newProduct, [event.target.name]: event.target.value } });
    };

    handleAddProduct = (event) => {
        event.preventDefault();

        const formData = new FormData();
        Object.entries(this.state.newProduct).forEach(([key, value]) => formData.append(key, value));
        if (this.state.newImage) {
            formData.append("image", this.state.newImage);
        }

        axios.post(`${SERVER_HOST}/products`, formData, authHeader())
            .then(res => {
                this.setState(prevState => ({
                    products: [...prevState.products, res.data],
                    newProduct: { ...emptyProduct },
                    newImage: null,
                    errorMessage: ""
                }));
                event.target.reset();
            })
            .catch(err => this.setState({ errorMessage: err.response?.data?.errorMessage || "Could not add the product." }));
    };

    handleDeleteProduct = (productId) => {
        axios.delete(`${SERVER_HOST}/products/${productId}`, authHeader())
            .then(() => {
                this.setState(prevState => ({
                    products: prevState.products.filter(product => product._id !== productId)
                }));
            })
            .catch(err => console.error("Error deleting product:", err));
    };

    handleDeleteUser = (userId) => {
        axios.delete(`${SERVER_HOST}/users/${userId}`, authHeader())
            .then(() => {
                this.setState(prevState => ({
                    users: prevState.users.filter(user => user._id !== userId)
                }));
            })
            .catch(err => this.setState({ errorMessage: err.response?.data?.errorMessage || "Could not delete the user." }));
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }

        const { newProduct } = this.state;

        return (
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}

                <h2>Add a Product</h2>
                <form className="add-product" onSubmit={this.handleAddProduct}>
                    <input name="name" placeholder="Name" value={newProduct.name} onChange={this.handleProductChange} required />
                    <input name="price" type="number" step="0.01" min="0" placeholder="Price" value={newProduct.price} onChange={this.handleProductChange} required />
                    <input name="color" placeholder="Colour" value={newProduct.color} onChange={this.handleProductChange} />
                    <input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0 to 5)" value={newProduct.rating} onChange={this.handleProductChange} />
                    <input name="description" placeholder="Description" value={newProduct.description} onChange={this.handleProductChange} />
                    <input name="features" placeholder="Features, separated by commas" value={newProduct.features} onChange={this.handleProductChange} />
                    <input type="file" accept="image/*" onChange={(e) => this.setState({ newImage: e.target.files[0] })} />
                    <button type="submit">Add Product</button>
                </form>

                <h2>Manage Products ({this.state.products.length})</h2>
                {this.state.products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.products.map(product => (
                            <tr key={product._id}>
                                <td>{product.image && <img src={imageUrl(product.image)} alt="" className="admin-thumb" />}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.rating}</td>
                                <td>
                                    <button onClick={() => this.handleDeleteProduct(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <h2>Manage Users ({this.state.users.length})</h2>
                {this.state.users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.accessLevel === 2 ? "Admin" : "Customer"}</td>
                                <td>
                                    {user.accessLevel !== 2 && (
                                        <button onClick={() => this.handleDeleteUser(user._id)}>Delete</button>
                                    )}
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
