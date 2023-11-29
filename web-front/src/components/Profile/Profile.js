import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Profile.css';

function Profile() {
    const currentUsername = useSelector(state => state.username);

    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        zipcode: "",
        password: "",
    });
    const [errors, setErrors] = useState({});


    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users?username=${currentUsername}`)
            .then(response => response.json())
            .then(data => {
                setUserData(data[0] || {});
            });
    }, [currentUsername]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(values => ({
            ...values,
            [name]: value
        }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        let newErrors = {};

        if (formData.username && !/^([a-zA-Z][a-zA-Z0-9]*)$/.test(formData.username)) {
            newErrors.username = "Invalid username. It can only contain letters and numbers and must start with a letter.";
        }

        if (formData.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number format should be: 123-123-1234.';
        }

        const zipcodeRegex = /^\d{5}$/;
        if (formData.zipcode && !zipcodeRegex.test(formData.zipcode)) {
            newErrors.zipcode = 'Zipcode should be 5 digits.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const updatedData = { ...userData };
            if (formData.username) updatedData.username = formData.username;
            if (formData.email) updatedData.email = formData.email;
            if (formData.phone) updatedData.phone = formData.phone;
            if (formData.zipcode) {
                if (!updatedData.address) updatedData.address = {};
                updatedData.address.zipcode = formData.zipcode;
            }
            if (formData.password) {
                if (!updatedData.address) updatedData.address = {};
                updatedData.address.street = formData.password;
            }
            setUserData(updatedData);

            setFormData({
                username: "",
                email: "",
                phone: "",
                zipcode: "",
                password: "",
            });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Section */}
                <div className="col-1"></div>
                <div className="col-4">
                    <div className='left-section'>
                        <div className='left-top-section'>
                            {/* Navbar div */}
                            <div className="mb-4 nav-bar">
                                <Link className="nav-link" to="/main">Main Page</Link>
                            </div>
                            {/* Upload picture div */}
                            <div className="mb-4 upload-picture">
                                <input type="file" />
                            </div>
                        </div>
                        {/* Current info div */}
                        <div className='current-info'>
                            <h5>User Info</h5>
                            <p><span>Username: </span>{userData?.username}</p>
                            <p><span>Email: </span>{userData?.email}</p>
                            <p><span>Phone: </span>{userData?.phone}</p>
                            <p><span>Zip Code: </span>{userData?.address?.zipcode}</p>
                            <p><span>Password: </span>{'*'.repeat(userData?.address?.street.length)}</p>
                        </div>

                    </div>
                </div>
                <div className="col-2"></div>
                {/* Right Section */}
                <div className="col-4">
                    <div className='right-section'>
                        {/* Logo zone div */}
                        <div className="col-md-8 logo-zone" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="https://brand.rice.edu/sites/g/files/bxs2591/files/2019-08/190308_Rice_Mechanical_Brand_Standards_Logos-9.png" alt="FolkZone" style={{ width: '100%', height: 'auto' }} />
                        </div>
                        {/* Update info div */}
                        <div className='update-info'>
                            <h5>Update Info</h5>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-2">
                                    <label className="form-label">Username
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
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
                                        />
                                    </label>
                                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Zipcode
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="zipcode"
                                            value={formData.zipcode}
                                            onChange={handleInputChange}
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
                                        />
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Update</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-1"></div>
            </div>
        </div>
    );
}

export default Profile;
