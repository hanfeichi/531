import React from 'react';
import Registration from './Registration';
import Login from './Login';
import './Landing.css';

function Landing() {
    return (
        <div className="container">
            <div className="row">
                <div className='col-md-1'></div>
                <div className="col-md-4">
                    <Registration />
                </div>
                <div className='col-md-2'></div>
                <div className="col-md-4">
                    <Login />
                </div>
                <div className='col-md-1'></div>
            </div>
        </div>
    );
}

export default Landing;


