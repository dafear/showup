 const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
var db = mongoose.createConnection("mongodb://dafear:sidney12@ds155091.mlab.com:55091/showup");




module.exports = db; 











