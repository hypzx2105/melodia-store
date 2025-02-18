import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../configClient/global_constants.js";
import "../Styles/profile.scss";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: localStorage.getItem("profilePic") || "",
            name: props.user.name || "",
            email: props.user.email || "",
        };
    }

    componentDidMount() {
        const userId = localStorage.getItem("userId");

        if (userId) {
            axios.get(`${SERVER_HOST}/users/profile/${userId}`)
                .then(response => {
                    if (response.data.profilePic) {
                        const profileImageUrl = `${SERVER_HOST}${response.data.profilePic}`;
                        this.setState({ profilePic: profileImageUrl });
                        localStorage.setItem("profilePic", profileImageUrl);
                    }
                })
                .catch(err => console.error("Error fetching profile data:", err));
        }
    }

    handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const userId = localStorage.getItem("userId");

        if (!userId || userId === "null") {
            console.error("User ID is missing. Cannot upload image.");
            return;
        }

        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("userId", userId);

            try {
                const response = await axios.post(`${SERVER_HOST}/users/upload-profile-pic`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
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
        const { profilePic, name, email } = this.state;

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
                    <input type="file" onChange={this.handleImageUpload} className="upload-btn" />
                </div>
            </div>
        );
    }
}

export default ProfilePage;
