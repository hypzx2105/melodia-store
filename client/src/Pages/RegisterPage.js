import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../configClient/global_constants.js";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            selectedFile: null,
            errorMessage: "",
            isRegistered: false,
            wasSubmittedAtLeastOnce: false
        };

        // Bind methods
        this.handleChange = this.handleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateName = (name) => {
        return name.trim() !== "";
    };

    validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!#€$%^&*]).{6,20}$/;
        return passwordRegex.test(password);
    };

    validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleFileChange(e) {
        this.setState({ selectedFile: e.target.files[0] });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { name, email, password, confirmPassword } = this.state;

        if (!this.validateName(name)) {
            this.setState({ errorMessage: "Name is required", wasSubmittedAtLeastOnce: true });
            return;
        }

        if (!this.validateEmail(email)) {
            this.setState({ errorMessage: "Invalid email format", wasSubmittedAtLeastOnce: true });
            return;
        }

        if (!this.validatePassword(password)) {
            this.setState({
                errorMessage: "Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
                wasSubmittedAtLeastOnce: true
            });
            return;
        }

        if (!this.validateConfirmPassword(password, confirmPassword)) {
            this.setState({ errorMessage: "Passwords do not match", wasSubmittedAtLeastOnce: true });
            return;
        }

        axios.post(`${SERVER_HOST}/users/register`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                sessionStorage.setItem("name", res.data.name);
                sessionStorage.setItem("email", res.data.email);
                sessionStorage.setItem("role", res.data.role);
                sessionStorage.setItem("token", res.data.token);

                this.setState({ isRegistered: true });
            })
            .catch(err => {
                const errorMessage = err.response && err.response.data.errorMessage
                    ? err.response.data.errorMessage
                    : "An unexpected error occurred.";
                this.setState({ errorMessage });
            });
    }

    render() {
        let errorMessage = this.state.wasSubmittedAtLeastOnce ? <div className="error">{this.state.errorMessage}<br /></div> : null;

        return (
            <form className="form-container" noValidate id="loginOrRegistrationForm" onSubmit={this.handleSubmit}>
                {this.state.isRegistered ? <Navigate to="/ProductPage" /> : null}

                <h2>New User Registration</h2>

                <input name="name" type="text" placeholder="Name" autoComplete="name" value={this.state.name} onChange={this.handleChange} /><br />
                <input name="email" type="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.handleChange} /><br />
                <input name="password" type="password" placeholder="Password" autoComplete="password" value={this.state.password} onChange={this.handleChange} /><br />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" autoComplete="new-password" value={this.state.confirmPassword} onChange={this.handleChange} /><br />

                <input type="file" onChange={this.handleFileChange} /><br /><br />
                <div className="nav-item">
                    <button type="submit" className="registerButt">Register</button>
                    <Link className="red-button" to={"/ProductPage"}>Cancel</Link>
                </div>
                {errorMessage}
            </form>
        );
    }
}


