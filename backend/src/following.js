const mongoose = require('mongoose');
const { Profile } = require('./schema');

async function getFollowing(req, res) {
    const { user } = req.params;
    console.log(user);
    try {
        const profile = await Profile.findOne({ username: user });
        if (!profile) {
            return res.status(404).send({ error: 'Profile not found.' });
        }
        res.json({ username: user, following: profile.following });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

async function addFollowing(req, res) {
    const { user } = req.params;
    const loggedInUser = req.username;

    try {
        const profile = await Profile.findOneAndUpdate(
            { username: loggedInUser },
            { $addToSet: { following: user } },
            { new: true }
        );
        res.json({ username: loggedInUser, following: profile.following });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

async function removeFollowing(req, res) {
    const { user } = req.params;
    const loggedInUser = req.username;

    try {
        const profile = await Profile.findOneAndUpdate(
            { username: loggedInUser },
            { $pull: { following: user } },
            { new: true }
        );
        if (!profile) {
            return res.status(404).send({ error: 'Profile not found.' });
        }
        res.json({ username: loggedInUser, following: profile.following });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error.' });
    }
}

module.exports = (app) => {
    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', addFollowing);
    app.delete('/following/:user', removeFollowing);
};
