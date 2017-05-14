var express = require('express');

var app = express();
var path = require('path');

 app.use(express.static('public'));
///app starting points are verbs like get, post, delete, put, patch updates what was there//
app.get('/search' ,function (req, res) {
 console.log('hello',req.query.q)
 res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.listen(process.env.PORT || 8080);

exports.app = app;