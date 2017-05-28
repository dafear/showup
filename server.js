const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');








 mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();
 

const stateRouter = require('./users/stateRouter.js');
 const {PORT, DATABASE_URL} = require('./config');




app.use('/', stateRouter);
 app.use(morgan('common'));
 app.use(express.static('public'));





///app starting points are verbs like get, post, delete, put, patch updates what was there//
app.get('/search' ,function (req, res) {
 console.log('hello',req.query.q)
 res.sendFile(path.join(__dirname + '/public/index.html'));
});


let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
     

      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  // mongoose.createConnection("mongodb://dafear:sidney12@ds155091.mlab.com:55091/showup");
  
  setTimeout(function() {
runServer().catch(err => console.error(err));
  }, 2000);
};


  // app.listen(process.env.PORT || 8080);

  //app.listen(process.env.port || 8080, function (){ mongoose.connect('mongodb://localhost/showup'); });

// var db = mongoose.connection;
// db.once('open', function() {
 // console.log('hi');

 // runServer().catch(err => console.error(err));
// });

module.exports = {app, runServer, closeServer};




