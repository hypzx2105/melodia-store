import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../configClient/global_constants";
import { Navigate } from "react-router-dom";
import "../Styles/styles.scss";

class RegisterPage extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        profilePic: null,
        redirect: false,
        errorMessage: ""
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleFileChange = (event) => {
        this.setState({ profilePic: event.target.files[0] });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", this.state.name);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        if (this.state.profilePic) {
            formData.append("profilePic", this.state.profilePic);
        }

        try {
            await axios.post(`${SERVER_HOST}/users/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            this.setState({ redirect: true });
        } catch (error) {
            this.setState({ errorMessage: error.response?.data?.errorMessage || "Registration failed." });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/login" />;
        }

        return (
            <div className="register-container">
                <h1>New User Registration</h1>
                {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={this.handleInputChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={this.handleInputChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={this.handleInputChange} required />
                    <input type="file" name="profilePic" onChange={this.handleFileChange} accept="image/*" />
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        );
    }
}

export default RegisterPage;
