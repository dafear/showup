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
        
        res.body.length.should.be.at.least(1);
        
        const expectedKeys = ['url', 'name', 'address', 'city'];
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
      
      }).catch(function(error) {
        console.log(error)
      })
  });

  
  
  it('should update Search items on PUT', function() {
    
    const updateSearchData = {
      name: 'foo',
      checked: true
    };

     chai.request(app)
     
      .get('/searches')
      .then(function(res) {
        updateSearchData.id = res.body[0].id;
        
         chai.request(app)
          .put(`/searches/${updateSearchData.url.name.address.city}`)
          .send(updateSearchData);
      })
      
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateSearchData);
      }).catch(function(error) {
        console.log(error)
      })
       
      
  });

 
  it('should delete Search id on DELETE', function() {
     chai.request(app)
     

      .get('/searches')
      .then(function(res) {
      
         chai.request(app)
          .delete(`/searches/${res.body[0]._id}`);
    })
        .then(function(res) {
         res.should.have.status(204);
       }).catch(function(error) {
         console.log(error)
       })
  });
});