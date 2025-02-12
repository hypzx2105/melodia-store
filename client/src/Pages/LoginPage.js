import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

import { SERVER_HOST } from "../configClient/global_constants.js";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            isLoggedIn: false
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${SERVER_HOST}/users/login`, {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                if (res.data.token) {
                    sessionStorage.setItem("token", res.data.token);
                    sessionStorage.setItem("role", res.data.role);  // Store user role
                    sessionStorage.setItem("name", res.data.name);
                    sessionStorage.setItem("email", res.data.email);

                    if (res.data.profilePhoto) {
                        sessionStorage.setItem("profilePhoto", res.data.profilePhoto);
                    }

                    console.log("User logged in.");
                    this.setState({ isLoggedIn: true });
                }
            })
            .catch(err => {
                this.setState({ errorMessage: "Invalid email or password." });
            });
    };

    render() {
        if (this.state.isLoggedIn) {
            return <Navigate to="/ProductPage" />;
        }

        return (
            <form className="form-container" onSubmit={this.handleSubmit}>
                <h2>Login</h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                /><br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={this.state.password}
                    onChange={this.handleChange}
                /><br /><br />

                <button type="submit" className="green-button">Login</button>
                <Link className="red-button" to={"/ProductPage"}>Cancel</Link>

                {this.state.errorMessage && <div className="error">{this.state.errorMessage}<br /></div>}
            </form>
        );
    }
}





