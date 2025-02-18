import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../configClient/global_constants";
import { Navigate } from "react-router-dom";
import "../Styles/styles.scss";

class LoginPage extends Component {
    state = {
        email: "",
        password: "",
        redirect: false,
        errorMessage: ""
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${SERVER_HOST}/users/login`, {
                email: this.state.email,
                password: this.state.password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("profilePic", response.data.profilePic || "");

            this.props.updateUserState();
            this.setState({ redirect: true });
        } catch (error) {
            this.setState({ errorMessage: error.response?.data?.errorMessage || "Login failed." });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }

        return (
            <div className="login-container">
                <h1>Login</h1>
                {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
                <form onSubmit={this.handleSubmit}>
                    <input type="email" name="email" placeholder="Email" onChange={this.handleInputChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={this.handleInputChange} required />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/register">Register</a></p>
            </div>
        );
    }
}

export default LoginPage;
