const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
});

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Number, // Date in millionseconds
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    following: {
        type: [String],
        default: []
    },
    headline: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    }
});

const articleSchema = new mongoose.Schema({
    id: { // This will be manually incremented
        type: Number,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    comments: [{
        commentId: Number,
        author: String,
        text: String
    }]
});

const User = mongoose.model('user', userSchema);
const Profile = mongoose.model('profile', profileSchema);
const Article = mongoose.model('article', articleSchema);

module.exports = {
    User,
    Profile,
    Article
};