import React from 'react';
import Landing from './components/Landing/Landing';
import Main from './components/Main/Main';
import Profile from './components/Profile/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/main" element={<Main />} />
                <Route path="/profile" element={<Profile />} />
                {/* Other routes go here */}
            </Routes>
        </Router>
    );
}

export default App;
