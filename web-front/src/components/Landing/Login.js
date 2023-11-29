import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions.js';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("response ok");
                // 假设后端返回了用户信息
                setErrors('Valid username or password');
                dispatch(setUser(username));
                localStorage.setItem("currentUser", JSON.stringify(data.username));
                navigate('/main');
            } else {
                setErrors(data.error || 'Invalid username or password');
            }
        } catch (error) {
            setErrors('An error occurred while logging in');
            console.error('Login error:', error);
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const matchedUser = users.find(user => user.username === username && user.address.street === password);
    //     if (matchedUser) {
    //         setErrors('Valid username or password');
    //         dispatch(setUser(username));
    //         localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    //         navigate('/main');
    //     } else {
    //         setErrors('Invalid username or password');
    //     }
    // };

    return (
        <div className="container mt-5">
            <h2 className="heading">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Username
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            data-testid="username-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="form-label">Password
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            data-testid="password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {errors && <div className="text-danger">{errors}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;
