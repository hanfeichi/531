const mongoose = require('mongoose');
const { Profile } = require('./schema');

// Utility function to get profile information
async function getProfileInfo(req, res, field) {
    const user = req.params.user
    try {
        const profile = await Profile.findOne({ username: user });
        if (!profile) {
            return res.status(404).send({ error: 'User not found.' });
        }
        const info = { username: user };
        info[field] = profile[field];
        res.json(info);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

// Utility function to update profile information
async function updateProfileInfo(req, res, field) {
    const loggedInUser = req.username; 
    const value = req.body[field];

    if (value === undefined) {
        return res.status(400).send({ error: `${field} is required.` });
    }

    try {
        const profile = await Profile.findOneAndUpdate(
            { username: loggedInUser },
            { $set: { [field]: value } },
            { new: true }
        );
        if (!profile) {
            return res.status(404).send({ error: 'User not found.' });
        }
        const info = { username: loggedInUser };
        info[field] = profile[field];
        res.json(info);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

module.exports = (app) => {
    app.get('/email/:user?', (req, res) => getProfileInfo(req, res, 'email'));
    app.put('/email', (req, res) => updateProfileInfo(req, res, 'email'));

    app.get('/zipcode/:user?', (req, res) => getProfileInfo(req, res, 'zipcode'));
    app.put('/zipcode', (req, res) => updateProfileInfo(req, res, 'zipcode'));

    app.get('/dob/:user?', (req, res) => getProfileInfo(req, res, 'dob'));

    app.get('/avatar/:user?', (req, res) => getProfileInfo(req, res, 'avatar'));
    app.put('/avatar', (req, res) => updateProfileInfo(req, res, 'avatar'));

    app.get('/phone/:user?', (req, res) => getProfileInfo(req, res, 'phone'));
    app.put('/phone', (req, res) => updateProfileInfo(req, res, 'phone'));

    app.get('/headline/:user?', (req, res) => getProfileInfo(req, res, 'headline'));
    app.put('/headline', (req, res) => updateProfileInfo(req, res, 'headline'));
};