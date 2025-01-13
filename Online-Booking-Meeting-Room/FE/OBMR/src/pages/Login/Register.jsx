import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import RightSide from "../../components/Login/rightside"
import axios from 'axios';
import '../../styles/style.css'

function Register() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Hàm toggle hiển thị/ẩn mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const registerUser = async (data) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        alert("Registration successful! Please check your email to activate your account.");
    };

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        const data = {
            login: username,
            email: email,
            password: password,
            firstName: "",
            lastName: ""
        };
    
        try {
            await registerUser(data);
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };
    return (
        <div className="d-flex custom-vh bg-light">
            {/* Left Side - Login Form */}
            <div className="d-flex flex-column justify-content-center custom-w bg-white px-5 ">
                <h2 className="text-center mb-4 custom-h2">Register</h2>
                <form className="custom-p" onSubmit={handleSubmit}>
                    <div className="mb-2 ">
                        <label htmlFor="Username" className="form-label">Username </label>
                        <input
                            type="text"
                            id="Username"
                            className="form-control custom-input"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-2 ">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control custom-input"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-2 ">
                        <label htmlFor="phoneNumber" className="form-label">Phone number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="form-control custom-input"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-2 ">
                        <label htmlFor="password" className="form-label">
                            Your password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control custom-input"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}"
                                title="Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
                            />
                            <span

                                onClick={togglePasswordVisibility}
                                className="btn btn-custom1"
                            >
                                {/* Icon hiển thị hoặc ẩn */}
                                {showPassword ? (
                                    <i className="fa-solid fa-eye"></i>
                                ) : (
                                    <i className="fa-solid fa-eye-slash"></i>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="mb-2 ">
                        <label htmlFor="Confpassword" className="form-label">
                            Confirm your password
                        </label>
                        <div className="input-group">
                            <input
                                type="password"
                                id="Confpassword"
                                className="form-control custom-input"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}"
                                title="Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."

                            />

                        </div>
                    </div>

                    <button type="submit" className="btn btn-custom w-100">Register</button>
                </form>
                <div className="mt-3 text-center">

                    <p className="mt-2">
                        Already have an account? <a href="/login" className=" form-label text-decoration-none">Login now</a>
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <RightSide />

        </div>


    );
}
export default Register;
