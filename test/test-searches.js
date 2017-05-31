const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const should = chai.should();


const {Search} = require('../users/models.js');
const {app, runServer, closeServer} = require('../server.js');
const {DATABASE_URL} = require('../config');


chai.use(chaiHttp);


describe('Search', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  
  it('should list Search items on GET', function() {
   
    return chai.request(app)
      .get('/searches')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        // because we create three items on app load
        res.body.length.should.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['url', 'name', 'address'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      }).catch(function(error) {
        console.log(error)
      })
    });
      
     

  
  it('should add Search on POST', function() {
    const newSearch = { url: 'www.anything.com', name: 'coffee', address: 'nys', city: 'anyplace', id: '2348ad98934ty78'};
    return chai.request(app)
      .post('/searches')
      .send(newSearch)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('url', 'name', 'address', 'city', 'id');
        res.body.id.should.not.be.null;
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        //res.body.should.deep.equal(Object.assign(newSearch, {url: res.body.url}));
      }).catch(function(error) {
        console.log(error)
      })
  });

  // test strategy:
  //  1. initialize some update data (we won't have an `id` yet)
  //  2. make a GET request so we can get an item to update
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it
  //  has right status code and that we get back an updated
  //  item with the right data in it.
  it('should update Search items on PUT', function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    const updateSearchData = {
      name: 'foo',
      checked: true
    };

     chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/searches/:id')
      .then(function(res) {
        updateSearchData.id = res.body[0].id;
        // this will return a promise whose value will be the response
        // object, which we can inspect in the next `then` back. Note
        // that we could have used a nested callback here instead of
        // returning a promise and chaining with `then`, but we find
        // this approach cleaner and easier to read and reason about.
         chai.request(app)
          .put(`/searches/:id/${updateSearchData.id}`)
          .send(updateSearchData);
      })
      // prove that the PUT request has right status code
      // and returns updated item
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateSearchData);
      }).catch(function(error) {
        console.log(error)
      })//.catch(function(error) {
        //console.log('Put error', error)
       
      //})
  });

  // test strategy:
  //  1. GET a shopping list items so we can get ID of one
  //  to delete.
  //  2. DELETE an item and ensure we get back a status 204
  it('should delete Search id on DELETE', function() {
     chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/searches/:id')
      .then(function(res) {
         chai.request(app)
          .delete(`/searches/:id/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      }).catch(function(error) {
        console.log(error)
      })
  });
});