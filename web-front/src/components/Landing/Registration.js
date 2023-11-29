import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Registration() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        dob: "",
        zipcode: "",
        password: "",
        passwordConfirmation: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(values => ({
            ...values,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!/^([a-zA-Z][a-zA-Z0-9]*)$/.test(formData.username)) {
            newErrors.username = "Invalid username. It can only contain letters and numbers and must start with a letter.";
        }

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number format should be: 123-123-1234.';
        }

        const zipcodeRegex = /^\d{5}$/;
        if (!zipcodeRegex.test(formData.zipcode)) {
            newErrors.zipcode = 'Zipcode should be 5 digits.';
        }

        const currentYear = new Date().getFullYear();
        const birthYear = new Date(formData.dob).getFullYear();
        if (currentYear - birthYear < 18) {
            newErrors.dob = 'You must be at least 18 years old to register.';
        }

        if (formData.password !== formData.passwordConfirmation) {
            newErrors.passwordConfirmation = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        phone: formData.phone,
                        dob: formData.dob,
                        zipcode: formData.zipcode,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("response ok");
                    navigate('/main');
                } else {
                    console.error('Registration error:', data);
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };

    const handleClear = () => {
        setFormData({
            username: "",
            displayName: "",
            email: "",
            phone: "",
            dob: "",
            zipcode: "",
            password: "",
            passwordConfirmation: ""
        });
        setErrors({});
    };

    return (
        <div className="container mt-5">
            <h2 className="heading">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Username
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.username && <div className="text-danger">{errors.username}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Email Address
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Phone Number
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Date of Birth
                        <input
                            type="date"
                            className="form-control"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.dob && <div className="text-danger">{errors.dob}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Zipcode
                        <input
                            type="text"
                            className="form-control"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.zipcode && <div className="text-danger">{errors.zipcode}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Password
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="form-label">Confirm Password
                        <input
                            type="password"
                            className="form-control"
                            name="passwordConfirmation"
                            value={formData.passwordConfirmation}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    {errors.passwordConfirmation && <div className="text-danger">{errors.passwordConfirmation}</div>}
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Register</button>
                <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            </form>
        </div>
    );
}

export default Registration;
