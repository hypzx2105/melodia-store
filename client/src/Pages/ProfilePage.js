import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST, authHeader } from "../configClient/global_constants.js";
import "../Styles/profile.scss";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: localStorage.getItem("profilePic") || "",
            name: props.user.name || "",
            email: props.user.email || "",
            orders: [],
        };
    }

    componentDidMount() {
        const userId = localStorage.getItem("userId");

        if (userId) {
            axios.get(`${SERVER_HOST}/users/profile/${userId}`, authHeader())
                .then(response => {
                    if (response.data.profilePic) {
                        const profileImageUrl = `${SERVER_HOST}${response.data.profilePic}`;
                        this.setState({ profilePic: profileImageUrl });
                        localStorage.setItem("profilePic", profileImageUrl);
                    }
                })
                .catch(err => console.error("Error fetching profile data:", err));

            axios.get(`${SERVER_HOST}/orders/mine`, authHeader())
                .then(response => this.setState({ orders: response.data }))
                .catch(err => console.error("Error fetching orders:", err));
        }
    }

    handleImageUpload = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await axios.post(`${SERVER_HOST}/users/upload-profile-pic`, formData, {
                    headers: { "Content-Type": "multipart/form-data", Authorization: localStorage.getItem("token") },
                });

                if (response.data.profilePic) {
                    const imageUrl = `${SERVER_HOST}${response.data.profilePic}`;
                    localStorage.setItem("profilePic", imageUrl);
                    this.setState({ profilePic: imageUrl });
                }

            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    render() {
        const { profilePic, name, email, orders } = this.state;

        return (
            <div className="profile-container">
                <h1>My Profile</h1>
                <div className="profile-card">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="profile-image" />
                    ) : (
                        <div className="profile-placeholder">No Image</div>
                    )}
                    <h2>{name}</h2>
                    <p>Email: {email}</p>
                    <label className="upload-btn">
                        Change picture
                        <input type="file" accept="image/*" onChange={this.handleImageUpload} />
                    </label>
                </div>

                <div className="orders">
                    <h2>My Orders</h2>
                    {orders.length === 0 ? (
                        <p>You haven't ordered anything yet.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="order">
                                <div className="order-top">
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>PayPal ID: {order.payPalPaymentID}</span>
                                    <strong>${order.total.toFixed(2)}</strong>
                                </div>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item.quantity} x {item.name} (${item.price})</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }
}

export default ProfilePage;
