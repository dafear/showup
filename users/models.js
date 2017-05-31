const mongoose = require('mongoose');
const db = require('./db');
 mongoose.createConnection("mongodb://dafear:sidney12@ds155091.mlab.com:55091/showup");

const searchSchema = mongoose.Schema({
  //id: {type: String, required: true},
  url: {type: String, required: true},
  name: {type: String, required: true},
  address: {type: String, required: true},
  city: {type: String, required: true},
  
  });

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
// stateSchema.virtual('addressString').get(function() {
  // return `${this.address.building} ${this.address.street}`.trim()});

// this virtual grabs the most recent grade for a restaurant.
// stateSchema.virtual('grade').get(function() {
  // const gradeObj = this.grades.sort((a, b) => {return b.date - a.date})[0] || {};
  // return gradeObj.grade;
// });

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
searchSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    url: this.url,
    name: this.name,
    address: this.address,
    city: this.city,
    
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Search = mongoose.model('Search', searchSchema);

module.exports = {Search};