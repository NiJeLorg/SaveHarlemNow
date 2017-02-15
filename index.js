'use strict';
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    port = 8000,
    app = express();


// serve static files
app.use(express.static('public'));

// log all requests to the console
app.use(morgan('dev'));

// create a basic route
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: 'public'
    });
});

// start the server
app.listen(port);
