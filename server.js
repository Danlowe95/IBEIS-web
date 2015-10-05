var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');

// set the static files location
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

// main catchall route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// start the server
app.listen(7070);
console.log('server running on port 7070');
