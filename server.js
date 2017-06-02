const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');

app.use(bodyParser.json());

mongoose.Promise = global.Promise;


 

const stateRouter = require('./users/stateRouter.js');
const searchRouter = require('./users/searchRouter.js');
const {PORT, DATABASE_URL} = require('./config');



app.use('/', stateRouter);
app.use('/', searchRouter);
app.use(morgan('common'));
app.use(express.static('public'));






app.get('/search', function (req, res) {
 console.log('hello',req.query.q)
 res.sendFile(path.join(__dirname + '/public/index.html'));
});




let server;


   function runServer(databaseUrl=DATABASE_URL, port=PORT) {

    return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://dafear:sidney12@ds155091.mlab.com:55091/showup', err => {
     

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
  
  setTimeout(function() {
runServer().catch(err => console.error(err));
  }, 2000);
};


  

module.exports = {app, runServer, closeServer};




