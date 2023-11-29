const mongoose = require('mongoose');
const crypto = require('crypto');
const md5 = require('md5');
const { User, Profile } = require('./schema');

let sessionUser = {};
let cookieKey = "sid";

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

function isLoggedIn(req, res, next) {
    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.sendStatus(401);
    }

    let username = sessionUser[sid];
    if (username) {
        req.username = username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}

async function login(req, res) {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).send({ error: 'Invalid username or password.' });
        }

        // check password
        let hash = md5(user.salt + password);
        if (hash !== user.hash) {
            return res.status(401).send({ error: 'Invalid username or password.' });
        }

        // generate sid
        let sid = generateSessionId();
        sessionUser[sid] = username;

        // add cookie
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        res.send({ username: username, result: 'success' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function register(req, res) {
    const { username, email, phone, dob, zipcode, password } = req.body;

    if (!username || !email || !phone || !dob || !zipcode || !password) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    console.log("111");

    try {
        const user = await User.findOne({ username: username });

        if (user) {
            return res.status(400).send({ error: 'Username already exists.' });
        }

        const dobInMs = new Date(dob).getTime();
        const salt = username + new Date().getTime();
        const hash = md5(salt + password);

        const newUser = new User({
            username: username,
            salt: salt,
            hash: hash
        });

        const newProfile = new Profile({
            username: username,
            email: email,
            dob: dobInMs,
            phone: phone,
            zipcode: zipcode
        });

        await newUser.save();
        await newProfile.save();
        res.send({ result: 'success', username: username });
    } catch (error) {
        res.status(500).send(error);
    }
}

function logout(req, res) {
    // check if session id exists
    const sid = req.cookies[cookieKey];
    if (sid && sessionUser[sid]) {
        // delete session id
        delete sessionUser[sid];
        // delete cookie
        res.clearCookie(cookieKey);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
}

async function updatePassword(req, res) {
    const loggedInUser = req.username; 
    const { password } = req.body;

    if (!password) {
        return res.status(400).send({ error: 'New password is required.' });
    }

    try {
        const salt = loggedInUser + new Date().getTime(); 
        const hash = md5(salt + password); 
        const user = await User.findOneAndUpdate(
            { username: loggedInUser },
            { salt: salt, hash: hash },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.send({ username: loggedInUser, result: 'success' });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

module.exports = (app) => {
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
    app.put('/password', updatePassword);
    app.put('/logout', logout);
}