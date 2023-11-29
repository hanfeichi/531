const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./src/auth');
const articles = require('./src/articles');
const following = require('./src/following');
const profile = require('./src/profile');

// connect to mongoDB
const connectionString = 'mongodb+srv://fh22:24IQiK4S6fjdSn9d@backend.yruobur.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });


const app = express();
app.use(cors()); 
app.use(bodyParser.json());
app.use(cookieParser());
auth(app);
articles(app);
following(app);
profile(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});